<?php namespace AB\Tools\Forms;
/** @var \CBitrixComponent $this */
/** @var array $arParams */
/** @var array $arResult */
/** @var string $componentPath */
/** @var string $componentName */
/** @var string $componentTemplate */
/** @var \CBitrixComponent $component */
/** @global \CUser $USER */
/** @global \CMain $APPLICATION */

use AB\Tools\Debug;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Entity;
use Bitrix\Main\Loader;
use Bitrix\Iblock;

Loc::loadMessages(__FILE__);

Loader::includeModule('iblock');
Loader::includeModule('ab.iblock');

class FormIblock extends \CBitrixComponent
{
	/** @var array|bool|\CDBResult|\CUser|mixed */
	protected $USER;

	/**
	 * @var \CIBlockElement
	 */
	private $CIBlockElement;

	/**
	 * @param \CBitrixComponent|bool $component
	 */
	function __construct($component = false)
	{
		parent::__construct($component);
		global $USER;
		$this->USER = $USER;

		$this->CIBlockElement = new \CIBlockElement();
	}

	/**
	 * @method onPrepareComponentParams
	 * @param array $arParams
	 *
	 * @return array
	 */
	public function onPrepareComponentParams($arParams)
	{
		$this->arParams = $arParams;

		return $arParams;
	}

	public function getUser()
	{
		global $USER;
		if (!is_object($USER))
			$USER = new \CUser();

		return $USER;
	}

	public function getProperties()
	{
		$obProp = Iblock\PropertyTable::getList([
			'select' => ['ID', 'NAME', 'CODE', 'SORT', 'ACTIVE', 'DEFAULT_VALUE', 'PROPERTY_TYPE', 'LIST_TYPE', 'MULTIPLE', 'IS_REQUIRED'],
			'filter' => ['=IBLOCK_ID' => $this->arParams['IBLOCK_ID'], '=ACTIVE' => 'Y'],
			'order' => ['SORT' => 'ASC', 'NAME' => 'ASC'],
		]);

		while ($prop = $obProp->fetch()) {
			$this->arResult['PROPS'][$prop['CODE']] = $prop;
		}
	}

	public function addAsset()
	{
		$libPath = '/local/modules/ab.tools/asset';
		$assets['formLib'] = [
			'js' => [
				$libPath.'/js/shim/es6-shim.min.js',
				$libPath.'/js/shim/es6-sham.min.js',
				$libPath.'/js/is.min.js',
				$libPath.'/js/sweetalert.min.js',
			],
			'css' => [
				$libPath.'/css/preloaders.css',
				$libPath.'/css/sweetalert.css',
			],
		];

		foreach ($assets as $code => $asset) {
			\CJSCore::RegisterExt($code, $asset);
		}
	}

	public function saveFormAction($data = [])
	{
		$save = [
			'IBLOCK_ID' => $this->arParams['IBLOCK_ID'],
			'NAME' => 'Заявка '.date('d.m.Y H:i:s'),
		];

		if (isset($data['PREVIEW_TEXT'])){
			$save['PREVIEW_TEXT'] = $data['PREVIEW_TEXT'];
			$save['PREVIEW_TEXT_TYPE'] = 'html';
			unset($data['PREVIEW_TEXT']);
		}
		if (isset($data['DETAIL_TEXT'])){
			$save['DETAIL_TEXT'] = $data['DETAIL_TEXT'];
			$save['DETAIL_TEXT_TYPE'] = 'html';
			unset($data['DETAIL_TEXT']);
		}

		unset($data['sessid']);

		foreach ($data as $k => $value) {
			$save['PROPERTY_VALUES'][$k] = $value['VALUE'];
		}

		$ID = $this->CIBlockElement->Add($save, false, false);

		if(intval($ID) == 0){
			throw new \Exception(strip_tags($this->CIBlockElement->LAST_ERROR));
		}

		return [
			'ID' => $ID,
			'GOOD_MESSAGE' => $this->arParams['GOOD_MESSAGE']
		];
	}

	/**
	 * @method executeComponent
	 * @return mixed|void
	 */
	public function executeComponent()
	{
		$this->addAsset();

		if (intval($this->arParams['IBLOCK_ID']) == 0){
			ShowError('Нет ИД инфоблока');

			return false;
		}

		$this->getProperties();

		$this->includeComponentTemplate();
	}
}