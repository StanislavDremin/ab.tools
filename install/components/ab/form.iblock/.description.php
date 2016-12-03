<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

$arComponentDescription = array(
	"NAME" => 'Формы для инфоблоков',
	"DESCRIPTION" => 'Обратная связь и всякая такая ботва',
	"ICON" => "/images/news_list.gif",
	"SORT" => 10,
	"CACHE_PATH" => "Y",
	"PATH" => array(
		"ID" => "ab_components",
		"NAME" => 'Abra компоненты',
		"CHILD" => array(
			"ID" => "forms",
			"NAME" => 'Формы',
			"SORT" => 10,
		),
	),
);

?>