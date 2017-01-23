<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
/** @var \CBitrixComponent $this */
/** @var array $arParams */
/** @var array $arResult */
/** @var string $componentPath */
/** @var string $componentName */
/** @var string $componentTemplate */
/** @var \CBitrixComponent $component */
/** @global \CUser $USER */
/** @global \CMain $APPLICATION */
?>
<script type="text/javascript">
	/**
	 * Created by dremin_s on 23.01.2017.
	 */
	/** @var o is */
	/** @var o $ */
	"use strict";

	$(function () {
		new window.AppForm({
			formId: '<?=$arParams['FORM_ID']?>',
			goodMessage: '<?=$arParams['GOOD_MESSAGE']?>',
			goodTitle: 'Спасибо!'
		});
	});
</script>
