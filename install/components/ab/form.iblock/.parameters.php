<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
/** @var array $arCurrentValues */
/** @global CUserTypeManager $USER_FIELD_MANAGER */
/** @var \Bitrix\Main\HttpRequest $request */
$request = \Bitrix\Main\Context::getCurrent()->getRequest();

use Bitrix\Main\Loader;
use Bitrix\Iblock;
use AB\Tools\Helpers\FormIblock as Helper;
use Bitrix\Main;
use Bitrix\Main\Localization\Loc;
if (!Loader::includeModule('iblock'))
	return;

if (!Loader::includeModule('ab.tools'))
	return;

Main\Localization\Loc::loadMessages(__FILE__);

$iblockExists = (!empty($arCurrentValues['IBLOCK_ID']) && (int)$arCurrentValues['IBLOCK_ID'] > 0);

$arIBlockType = CIBlockParameters::GetIBlockTypes();

$iblockFilter = (
!empty($arCurrentValues['IBLOCK_TYPE'])
	? array('TYPE' => $arCurrentValues['IBLOCK_TYPE'], 'ACTIVE' => 'Y')
	: array('ACTIVE' => 'Y')
);
$arIBlock = array(0 => ' - Выберите инфоблок - ');
$rsIBlock = CIBlock::GetList(array('SORT' => 'ASC'), $iblockFilter);
while ($IB = $rsIBlock->Fetch())
	$arIBlock[$IB['ID']] = '[' . $IB['ID'] . '] ' . $IB['NAME'];

/*$arProperty = array();
$forName = array('AB_CUR_DATE' => 'Номер заявки п\п и текущая дата-время');

if ($iblockExists) {
	$propertyIterator = Iblock\PropertyTable::getList(array(
		'select' => array('ID', 'IBLOCK_ID', 'NAME', 'CODE', 'PROPERTY_TYPE', 'MULTIPLE', 'LINK_IBLOCK_ID', 'USER_TYPE'),
		'filter' => array('=IBLOCK_ID' => $arCurrentValues['IBLOCK_ID'], '=ACTIVE' => 'Y'),
		'order' => array('SORT' => 'ASC', 'NAME' => 'ASC'),
	));
	while ($property = $propertyIterator->fetch()) {

		$propertyCode = (string)$property['CODE'];
		if ($propertyCode == '')
			$propertyCode = $property['ID'];
		$propertyName = '[' . $propertyCode . '] ' . $property['NAME'];

		$arProperty[$propertyCode] = $propertyName;
		$forName[$propertyCode] = $propertyName;
	}
	unset($propertyCode, $propertyName, $property, $propertyIterator);

	$fields = Helper::getIbFields();
	foreach ($fields as $code => $field) {
		$propertyName = '[' . $code . '] ' . $field['NAME'];
		$arProperty[$code] = $propertyName;
	}
}*/

$site = ($request["site"] <> ''? $request["site"] : ($request["src_site"] <> ''? $request["src_site"] : false));
$arFilter = array("TYPE_ID" => "AB_FORMS", "ACTIVE" => "Y");
if($site !== false)
	$arFilter["LID"] = $site;
$arEvent = array();
$dbType = CEventType::GetList(array('LID' => LANG), array('EVENT_NAME' => 'ASC'));
while($arType = $dbType->GetNext()) {
	$arEvent[$arType["EVENT_NAME"]] = '['.$arType['EVENT_NAME'].'] '.$arType["NAME"];
}

//$aInsert = array_merge(array(0 => 'Нет'), $arProperty);

$arComponentParameters = array(
	'GROUPS' => array(
		'BASE' => array('NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_BASE')),
		'EMAIL' => array('NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_EMAIL')),
		'AUTO_INSERT' => array('NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_AUTO_INSERT')),
		'RENAMES' => array('NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_RENAMES'))
	),
	'PARAMETERS' => array(
		'IBLOCK_TYPE' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_IBLOCK_TYPE'),
			'TYPE' => 'LIST',
			'VALUES' => $arIBlockType,
			'REFRESH' => 'Y',
			'PARENT' => 'BASE',
		),
		'IBLOCK_ID' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_IBLOCK_ID'),
			'TYPE' => 'LIST',
			'VALUES' => $arIBlock,
			'REFRESH' => 'Y',
			'PARENT' => 'BASE',
		),
		/*'FIELDS' => array(
			'NAME' => 'Поля формы',
			'TYPE' => 'LIST',
			'MULTIPLE' => 'Y',
			'VALUES' => $arProperty,
			'PARENT' => 'BASE',
//			'REFRESH' => 'Y',
		),
		'REQUIRED' => array(
			'NAME' => 'Обязятельные поля',
			'TYPE' => 'LIST',
			'MULTIPLE' => 'Y',
			'VALUES' => array_merge(array(0 => 'Все'), $arProperty),
			'PARENT' => 'BASE',
		),*/
		'FORM_ID' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_FORM_ID'),
			'DEFAULT' => 'form_request'
		),
		'FORM_NAME_BLOCK' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_FORM_NAME_BLOCK'),
			'DEFAULT' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_FORM_NAME_BLOCK_DEFAULT')
		),
		'BTN_SAVE' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_BTN_SAVE'),
			'DEFAULT' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_BTN_SAVE_DEFAULT')
		),
		'EMAIL_EVENT' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_EMAIL_EVENT'),
			'TYPE' => 'LIST',
			'VALUES' => $arEvent,
			'ADDITIONAL_VALUES' => 'Y',
			'DEFAULT' => 'AB_FORMS',
			'PARENT' => 'EMAIL',
		),
		'EMAIL_ADMIN' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_EMAIL_ADMIN'),
			'PARENT' => 'EMAIL',
		),
		'GOOD_MESSAGE' => array(
			'NAME' => Loc::getMessage('AB_TOOLS_FORM_IBLOCK_C_PARAM_GOOD_MESSAGE')
		)
		/*'A_INSERT_LOGIN' => array(
			'NAME' => 'Логин',
			'TYPE' => 'LIST',
			'VALUES' => $aInsert,
			'PARENT' => 'AUTO_INSERT',
		),
		'A_INSERT_EMAIL' => array(
			'NAME' => 'E-mail',
			'TYPE' => 'LIST',
			'VALUES' => $aInsert,
			'PARENT' => 'AUTO_INSERT',
		),
		'A_INSERT_PHONE' => array(
			'NAME' => 'Телефон',
			'TYPE' => 'LIST',
			'VALUES' => $aInsert,
			'PARENT' => 'AUTO_INSERT',
		),
		'NAME_ELEMENT' => array(
			'NAME' => 'Установить название элемента как:',
			'TYPE' => 'LIST',
			'VALUES' => $forName,
			'DEFAULT' => 'AB_CUR_DATE'
		),*/
	),
);

/*if(count($arProperty) > 0){
	foreach ($arProperty as $code => $arField) {
		$arComponentParameters['PARAMETERS']['RENAME_'.$code] = array(
			'NAME' => $arField,
			'PARENT' => 'RENAMES'
		);
	}
}*/