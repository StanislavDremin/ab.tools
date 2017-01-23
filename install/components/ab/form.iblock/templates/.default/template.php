<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

CUtil::InitJSCore('formLib');
$this->addExternalJs($componentPath.'/js/build.min.js');

$arProps = $arResult['PROPS'];
//PR($arProps);
//PR($arParams);
?>
<form class="form-horizontal" id="<?=$arParams['FORM_ID']?>" name="<?=$arParams['FORM_ID']?>">
	<div class="form-group">
		<label for="<?=$arProps['EMAIL']['CODE']?>" class="col-sm-2 control-label">
			<?=$arProps['EMAIL']['NAME']?>
		</label>
		<div class="col-sm-10">
			<input type="email" value="<?=$arProps['EMAIL']['VALUE']?>" name="<?=$arProps['EMAIL']['CODE']?>"
				class="form-control" id="<?=$arProps['EMAIL']['CODE']?>" placeholder="Введите Email">
		</div>
	</div>
	<div class="form-group">
		<label for="<?=$arProps['PHONE']['CODE']?>" class="col-sm-2 control-label">
			<?=$arProps['PHONE']['NAME']?>
		</label>
		<div class="col-sm-10">
			<input type="email" value="<?=$arProps['PHONE']['VALUE']?>" name="<?=$arProps['PHONE']['CODE']?>"
				class="form-control" id="<?=$arProps['PHONE']['CODE']?>" placeholder="Введите телефон">
		</div>
	</div>
	<div class="form-group">
		<label for="<?=$arProps['FIO']['CODE']?>" class="col-sm-2 control-label">
			<?=$arProps['FIO']['NAME']?>
		</label>
		<div class="col-sm-10">
			<input type="email" value="<?=$arProps['FIO']['VALUE']?>" name="<?=$arProps['FIO']['CODE']?>"
				class="form-control" id="<?=$arProps['FIO']['CODE']?>" placeholder="Введите ФИО">
		</div>
	</div>
	<div class="form-group">
		<div class="col-sm-offset-2 col-sm-10">
			<button type="submit" class="btn btn-success"><?=$arParams['BTN_SAVE']?></button>
		</div>
	</div>
</form>

