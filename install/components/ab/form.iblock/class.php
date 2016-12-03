<?php 
namespace AB\Forms;

/** @var \CBitrixComponent $this */
/** @var array $arParams */
/** @var array $arResult */
/** @var string $componentPath */
/** @var string $componentName */
/** @var string $componentTemplate */
/** @var \CBitrixComponent $component */

use Bitrix\Main\Loader;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Entity;
use AB\Tools;

Loader::includeModule('iblock');
Loader::includeModule('ab.tools');

class FormAdd extends \CBitrixComponent
{
	protected $USER;

	/**
	 * @param \CBitrixComponent|null $component
	 */
	public function __construct($component)
	{
		global $USER;
		parent::__construct($component);
		$this->USER = $USER;
	}

	/**
	 * @method onPrepareComponentParams
	 * @param $arParams
	 *
	 * @return mixed
	 */
	public function onPrepareComponentParams($arParams)
	{
		if(intval($arParams['CACHE_TIME']) == 0)
			$arParams['CACHE_TIME'] = 86400;

		return $arParams;
	}

	public function saveAction($post = [])
	{
		$arParams = Tools\Helpers\FormIblock::decodeParams($post['PARAMS']);
		$this->arParams = $this->onPrepareComponentParams($arParams);
		$arFields = $post['FIELDS'];

		$save = [
			'IBLOCK_ID' => $this->arParams['IBLOCK_ID'],
			'NAME' => date('d.m.Y H:i:s'),
			'PREVIEW_TEXT' => strlen($arFields['PREVIEW_TEXT']) > 0 ? $arFields['PREVIEW_TEXT'] : false,
			'PREVIEW_TEXT_TYPE' => 'html',
			'DETAIL_TEXT' => strlen($arFields['DETAIL_TEXT']) > 0 ? $arFields['DETAIL_TEXT'] : false,
			'DETAIL_TEXT_TYPE' => 'html',
		];

		unset($arFields['PREVIEW_TEXT']);
		unset($arFields['DETAIL_TEXT']);

		foreach ($arFields as $code => $field) {
			$save['PROPERTY_VALUES'][$code] = $field;
		}

		$CIBlockElement = new \CIBlockElement();
		$result = $CIBlockElement->Add($save, false, false);

		$out = null;
		if(intval($result) > 0){
			$out = $result;
		} else {
			throw new \Exception(strip_tags($CIBlockElement->LAST_ERROR));
		}

		return $out;
	}

	/**
	 * @method executeComponent
	 */
	public function executeComponent()
	{

		$this->arResult['ENC'] = Tools\Helpers\FormIblock::encodeParams($this->arParams);

		$this->includeComponentTemplate();
	}

}