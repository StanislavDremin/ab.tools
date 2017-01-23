<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
	die();
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
<form class="form-horizontal" id="<?=$arParams['FORM_ID']?>" name="<?=$arParams['FORM_ID']?>" method="post"
		novalidate="novalidate" autocomplete="off">
	<? foreach ($arProps as $code => $arProp): ?>
		<div class="form-group">
			<label for="<?=$code?>" class="col-sm-2 control-label">
				<?=$arProp['NAME']?>
			</label>
			<div class="col-sm-10">
				<input type="email"
						value="<?=$arProp['VALUE']?>"
						name="<?=$code?>"
						class="form-control" id="<?=$code?>"
						placeholder="Введите <?=$arProp['NAME']?>"
					<?=($arProp['IS_REQUIRED'] == 'Y' ? ' required' : false)?>
				/>
			</div>
		</div>
	<? endforeach; ?>

	<?=bitrix_sessid_post();?>

	<div class="form-group">
		<div class="col-sm-offset-2 col-sm-10">
			<button type="submit" class="btn btn-success"><?=$arParams['BTN_SAVE']?></button>
		</div>
	</div>
</form>