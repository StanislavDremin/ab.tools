<?php
/**
 * Created by OOO 1C-SOFT.
 * User: dremin_s
 * Date: 19.12.2016
 */

namespace AB\Tools\Rest;

use Bitrix\Main;
use Bitrix\Main\Web;

/**
 * Class Base
 * @package Esd\Ajax
 *
 * Коды ошибок:
 *  0 - 100 внутренние, системные ошибки, их можно показывать на ружу,
 *  только при установленном параметре $this->showSystemError = true;
 */
class Manager
{
	protected $request;
	protected $server;

	protected $namespace;
	protected $class;
	protected $action;
	
	protected $showSystemError = true;

	/** @var Web\Uri */
	protected $Uri;
	protected $params = [];
	protected $route = null;
	private $htmlMode = false;

	/** @var AjaxResult */
	protected $result;
	/** @var  Main\Type\Dictionary */
	protected $data;

	const SYSTEM_ERR_CODE = 'SYSTEM';

	public function __construct()
	{
		$this->request = Main\Context::getCurrent()->getRequest();
		$this->server = Main\Context::getCurrent()->getServer();
	}
	
	/**
	 * @method parseUrl
	 * @throws RestException
	 */
	public function parseUrl()
	{
		$query = $this->request->get('data');
		$this->Uri = new Web\Uri($query);

		$arQuery = explode('/', $this->Uri->getPath());
		$action = array_pop($arQuery).'Action';

		$querySearch[] = '';
		$querySearch = implode('/', array_merge($querySearch, $arQuery));

		$class = str_replace(DIRECTORY_SEPARATOR, '\\', $querySearch);
		if (class_exists($class)){
			$this->setParams([
				'CLASS' => $class,
				'ACTION' => $action,
			]);
		} else {
			$server = \Bitrix\Main\Context::getCurrent()->getServer();
			$siteId = Main\Context::getCurrent()->getSite();
			if (strlen($siteId) == 0){
				$arSite = \Bitrix\Main\SiteDomainTable::getRow(['filter' => ['=DOMAIN' => $server->get('HTTP_HOST')]]);
				$siteId = $arSite['LID'];
			}

			$arRoute = Main\UrlRewriter::getList($siteId, ['CONDITION' => $querySearch])[0];
			if (empty($arRoute)){
				throw new RestException('Route is not exist', 40);
			}
			$this->route = $arRoute;
			$mainParams = [
				'CLASS' => $arRoute['PATH'],
				'MODULE' => $arRoute['ID'],
				'ACTION' => $action,
			];
			if (preg_match('/:/', $arRoute['ID'])){
				unset($mainParams['MODULE']);
				$mainParams['COMPONENT'] = $arRoute['ID'];
			}

			$this->setParams($mainParams);
		}

		return $this;
	}

	/**
	 * @method init
	 * @return $this
	 */
	public function init()
	{
		$this->setData();
		$this->result = new AjaxResult();

		try {
			if ($this->request->get('sessid') || $this->request->getPost('sessid')){
				if (!check_bitrix_sessid()){
					throw new RestException('sessid is not valid');
				}
			}

			$resultMethod = $this->instanceActionClass();

			$this->result->setData($resultMethod);

		} catch (\ReflectionException $Reflection) {
			$this->result->addSystemError(new Main\Error($Reflection->getMessage(), 30));

		} catch (\Exception $e) {
			$this->result->addError(new Main\Error($e->getMessage(), $e->getCode()));
		}

		return $this;
	}

	/**
	 * @method getResult
	 * @return mixed
	 */
	public function getResult()
	{
		if (defined('DEV_MODE')){
			$this->showSystemError = true;
		}

		$result = ['STATUS' => 1, 'ERRORS' => null, 'DATA' => null];

		$result['DATA'] = $this->result->getData();
		if (!$this->result->isSuccess()){
			$result['STATUS'] = 0;
			$errors = $this->result->getErrorMessages();
			$systems = $this->result->getSystemMessages();

			if (count($errors) > 0){
				$result['ERRORS'] = $errors;
			}
			if (count($systems) > 0 && $this->showSystemError === true){
				$result['SYSTEMS'] = $systems;
			}
		}

		if (!$this->getHtmlMode()){
			try {
				return Web\Json::encode($result);
			} catch (Main\ArgumentException $err) {
				return $err->getMessage();
			}
		} else {
			return $result['DATA'];
		}
	}


	/**
	 * @method setData
	 */
	public function setData()
	{
		$post = null;
		$contentType = $this->server->get('HTTP_ACCEPT');

		if (preg_match('{json}i', $contentType) != false){
			$this->setHtmlMode(false);
		} else {
			$this->setHtmlMode(true);
		}

		if ($this->request->isPost()){
			if ($this->getHtmlMode() === false){
				$data = Web\Json::decode(file_get_contents('php://input'));
			} else {
				$data = $this->request->getPostList()->toArray();
			}
		} else {
			$data = $this->request->toArray();
		}

		unset($data['data']);
		unset($data['type']);
		unset($data['action']);

		$this->data = new Main\Type\Dictionary($data);
	}

	/**
	 * @method instanceActionClass
	 * @return mixed
	 */
	public function instanceActionClass()
	{
		$initClass = new \ReflectionClass($this->getParams('CLASS'));
		$ob = $initClass->newInstance();
		$action = $this->getParams('ACTION');
		try {
			if (!is_callable([$ob, $action])){
				throw new RestException('Действие '.$action.' нельзя вызвать.', 20);
			}

			$component = $this->getParams('COMPONENT');
			if (strlen($component) > 0){
				if (strlen($this->server->get('HTTP_REFERER')) > 0){
					$Uri = new Web\Uri($this->server->get('HTTP_REFERER'));
					$realPath = $Uri->getPath();
					if (!preg_match('/\/index.php$/i', $Uri->getPath()) && !substr($realPath, -1, 1) != 'p'){
						$realPath .= 'index.php';
					}
					$arParams = Main\Component\ParametersTable::getRow([
						'filter' => ['=REAL_PATH' => $realPath, '=COMPONENT_NAME' => $component],
					]);
					$ob->onPrepareComponentParams(unserialize($arParams['PARAMETERS']));
				}
			}

			return $ob->$action($this->getData()->toArray());
		} catch (\Exception $err) {
			$code = $err->getCode();
			if ($code < 200 && $code != 0){
				$this->result->addSystemError(new Main\Error($err->getMessage(), $err->getCode()));
			} else {
				$this->result->addError(new Main\Error($err->getMessage(), $err->getCode()));
			}
		}
	}
	/**
	 * @method getData - get param data
	 * @return Main\Type\Dictionary
	 */
	public function getData()
	{
		return $this->data;
	}
	/**
	 * @method getParams
	 * @param string $k
	 *
	 * @return array|mixed
	 */
	public function getParams($k = '')
	{
		if(strlen($k) > 0){
			return $this->params[$k];
		}

		return $this->params;
	}

	/**
	 * @method setParams
	 * @param array $params
	 *
	 * @return $this
	 */
	public function setParams(array $params = [])
	{
		foreach ($params as $name => $param) {
			$this->addParams($name, $param);
		}

		return $this;
	}

	/**
	 * @method addParams
	 * @param $k
	 * @param $val
	 *
	 * @return $this
	 * @throws RestException
	 */
	public function addParams($k, $val)
	{
		$this->params[$k] = $val;

		if($k == 'ACTION' && strlen($val) == 0){
			throw new RestException('ACTION is empty', 10);
		}
		if($k == 'MODULE'){
			Main\Loader::includeModule($val);
		}
		if($k == 'COMPONENT'){
			\CBitrixComponent::includeComponentClass($val);
		}

		return $this;
	}

	/**
	 * @method getShowSystemError - get param showSystemError
	 * @return bool
	 */
	public function getShowSystemError()
	{
		return $this->showSystemError;
	}

	/**
	 * @param bool $showSystemError
	 *
	 * @return Manager
	 */
	public function setShowSystemError($showSystemError)
	{
		$this->showSystemError = $showSystemError;

		return $this;
	}

	/**
	 * @param Main\Result $result
	 *
	 * @return Manager
	 */
	public function setResult($result)
	{
		$this->result = $result;

		return $this;
	}

	/**
	 * @method getAction - get param action
	 * @return mixed
	 */
	public function getAction()
	{
		return $this->action;
	}

	/**
	 * @method setAction - set param Action
	 * @param mixed $action
	 */
	public function setAction($action)
	{
		$this->action = $action;
	}

	/**
	 * @method sanitizeData
	 * @param $data
	 *
	 * @return mixed
	 */
	private static function sanitizeData($data)
	{
		foreach ($data as $code => $value) {
			if(is_array($value)){
				$data[$code] = self::sanitizeData($value);
			} else {
				$data[$code] = htmlspecialcharsbx($value);
			}
		}

		return $data;
	}

	/**
	 * @method getHtmlMode - get param htmlMode
	 * @return boolean
	 */
	public function getHtmlMode()
	{
		return $this->htmlMode;
	}

	/**
	 * @param boolean $htmlMode
	 *
	 * @return Manager
	 */
	public function setHtmlMode($htmlMode)
	{
		$this->htmlMode = $htmlMode;

		return $this;
	}
}