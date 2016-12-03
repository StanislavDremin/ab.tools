<?php
/**
 * Created by PhpStorm.
 * User: dremin_s
 * Date: 15.08.2016
 * Time: 12:16
 */

namespace AB\Tools\Rest;

use AB\Tools\EventHandlers;
use AB\Tools\Helpers\DataCache;
use Bitrix\Main;
use Bitrix\Main\Web;

class Manager
{
	protected $request;
	protected $server;

	protected $namespace;
	protected $class;
	protected $action;
	protected $component;

	/** @var  Main\Type\Dictionary */
	protected $data;
	/** @var  Main\Result */
	private $result;
	private $htmlMode = false;
	private $isComponent = false;
	private $queryUrl;

	/**
	 * Manager constructor.
	 */
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
		$action = $class = $nameSpace = null;

		$Uri = new Web\Uri($this->request->getRequestUri());
		$url = $Uri->getPath();
		$url = trim($url, '!"#$%&\'()*+,-.@:;<=>[\\]^_`{|}~');

		$arUrl = explode('/', $url);
		TrimArr($arUrl);

		$action = array_pop($arUrl).'Action';
		$this->queryUrl = $Uri->getQuery();

		$url = implode('/', $arUrl);
		$route = Router::instance()->getRoute($url);
		if ($route && !empty($route['component']) && !empty($route['class'])){
			$this->setMainParams($route['class'], $action, $route['component']);
		} else {
			$url = preg_replace('#^rest|\/rest#i', '', $url);
			$class = str_replace('/', '\\', $url);
			$this->setMainParams($class, $action);
		}
	}

	/**
	 * @method setMainParams
	 * @param $class
	 * @param $action
	 * @param string $component
	 */
	protected function setMainParams($class, $action, $component = '')
	{
		$this->setClass($class);
		$this->setAction($action);
		if (strlen($component) > 0){
			\CBitrixComponent::includeComponentClass($component);
			$this->isComponent = $component;
		}
		$this->setData();
	}

	/**
	 * @method init
	 * @return $this
	 * @throws RestException
	 */
	public function init()
	{
		$result = new Main\Result();
		$resultAction = null;
		try {
			if ($this->request->get('sessid') || $this->request->getPost('sessid')){
				if (!check_bitrix_sessid()){
					throw new RestException('sessid is not valid');
				}
			}
			if ($this->getClass() == '\\'){
				if (is_callable($this->getAction())){
					$resultAction = call_user_func($this->getAction(), $this->getData()->toArray());
				} else {
					throw new RestException('Action is not callable');
				}
			} else {
				$resultAction = $this->instanceActionClass();
			}
		} catch (\ReflectionException $err) {
			$result->addError(new Main\Error($err->getMessage(), $err->getCode()));
		} catch (RestException $err) {
			$result->addError(new Main\Error($err->getMessage(), $err->getCode()));
		} catch (\Exception $err) {
			$result->addError(new Main\Error($err->getMessage(), $err->getCode()));
		}

		$out = [
			'DATA' => $resultAction,
			'ERRORS' => count($result->getErrorMessages()) > 0 ? $result->getErrorMessages() : null,
		];

		if (!is_null($out['ERRORS'])){
			$out['STATUS'] = 0;
		} else {
			$out['STATUS'] = 1;
		}
		$result->setData($out);
		$this->setResult($result);

		return $this;
	}

	/**
	 * @method instanceActionClass
	 * @return mixed
	 */
	protected function instanceActionClass()
	{
		$action = $this->getAction();
		$class = $this->getClass();

		$initClass = new \ReflectionClass($class);
		$dataPost = $this->getData()->toArray();
		if ($this->isComponent){
			/** @var \CBitrixComponent $ob */
			$ob = $initClass->newInstance();

			$cache = new DataCache(EventHandlers::CACHE_PARAM_TTL, EventHandlers::CACHE_PARAM_DIR, EventHandlers::CACHE_PARAM_ID);
			if ($cache->isValid()){
				$params = $cache->getData();
			} else {
				$ParametersTable = \Bitrix\Main\Component\ParametersTable::getEntity();
				if (!$ParametersTable->getField('PARAMETERS')->isSerialized()){
					$ParametersTable->getField('PARAMETERS')->setSerialized();
				}
				/** @var Main\Entity\DataManager $classParams */
				$classParams = $ParametersTable->getDataClass();
				$rowParam = $classParams::getRow([
					'select' => ['PARAMETERS'],
					'filter' => ['=COMPONENT_NAME' => $this->isComponent, '=SITE_ID' => Main\Context::getCurrent()->getSite()],
				]);
				$cache->addCache($rowParam['PARAMETERS']);
				$params = $rowParam['PARAMETERS'];
			}

			$ob->onPrepareComponentParams($params);

		} else {
			$ob = $initClass->newInstance();
		}

		$initClass->getMethod($action);

		return $ob->$action($dataPost);
	}

	/**
	 * @method getResult
	 * @return mixed
	 */
	public function getResult()
	{
		$data = $this->result->getData();

		if ($this->getHtmlMode() === true){
			return $data['DATA'];
		} else {
			try {
				$out = Web\Json::encode($data);
			} catch (Main\ArgumentException $err) {
				$out['DATA'] = null;
				$out['ERRORS'][] = $err->getMessage();
				$out['STATUS'] = 0;
			}

			return $out;
		}
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
	 * @method getClass - get param class
	 * @return mixed
	 */
	public function getClass()
	{
		return $this->class;
	}

	/**
	 * @method setClass - set param Class
	 * @param mixed $class
	 */
	public function setClass($class)
	{
		$this->class = $class;
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
	 * @method getNamespace - get param namespace
	 * @return mixed
	 */
	public function getNamespace()
	{
		return $this->namespace;
	}

	/**
	 * @method setNamespace - set param Namespace
	 * @param mixed $namespace
	 */
	public function setNamespace($namespace)
	{
		if (substr($namespace, 0, 1) != '\\'){
			$namespace = '\\'.$namespace;
		}

		$this->namespace = $namespace;
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

		unset($data['type']);
		unset($data['action']);

		if (strlen($this->queryUrl) > 0 && $this->request->isPost()){
			$param = [];
			$fragment = explode('&', $this->queryUrl);
			foreach ($fragment as $item) {
				preg_match('/(.*)=(.*)/', $item, $match);
				$param[$match[1]] = $match[2];
			}
			TrimArr($param);
			if (!isset($data['request'])){
				$data['request'] = $param;
			} else {
				$data = array_merge($data, $param);
			}
		}

		$this->data = new Main\Type\Dictionary($data);
	}

	/**
	 * @method addData
	 * @param $k
	 * @param $val
	 *
	 * @return $this
	 */
	public function addData($k, $val)
	{
		$vv = self::sanitizeData($val);

		$this->data->offsetSet($k, $vv);

		return $this;
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
			if (is_array($value)){
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