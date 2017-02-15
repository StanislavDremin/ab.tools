<?php
/**
 * Created by PhpStorm.
 * User: dremin_s
 * Date: 15.08.2016
 * Time: 12:13
 */

namespace AB\Tools;


use Bitrix\Main\Loader;

class EventHandlers
{
	const CACHE_PARAM_TTL = 3600;
	const CACHE_PARAM_DIR = '/ab/tools/params';
	const CACHE_PARAM_ID = 'ab_component_params';


	public static function onPageStart()
	{
		Loader::includeModule('ab.tools');

	}

	public static function OnProlog()
	{
		$CacheTag = new Helpers\DataCache(self::CACHE_PARAM_TTL, self::CACHE_PARAM_DIR, self::CACHE_PARAM_ID);
		global $USER;
		/** @var \Bitrix\Main\HttpRequest $request */
		$request = \Bitrix\Main\Context::getCurrent()->getRequest();
		if($request->get('clear_cache') === 'Y' && $USER->IsAdmin()){
			$CacheTag->clear();
		}
	}

	public static function onIncludeHTMLEditorScript()
	{
		$path = '/local/modules/ab.tools/asset';
		\CJSCore::RegisterExt('ab_html_edit', [
			'js' => [
				$path.'/js/shim/es6-shim.min.js',
				$path.'/js/shim/es6-sham.min.js',
				$path.'/js/react/react-with-addons.min.js',
				$path.'/js/react/react-dom.min.js',
				$path.'/js/htmlEditor/lib/prism.js',
				$path.'/js/htmlEditor/build/ab.htmlEditor.js',
			],
			'css' => [
//				'/bitrix/css/main/bootstrap.min.css',
				$path.'/js/htmlEditor/lib/prism.css',
				$path.'/css/ab_html_edit.css'
			]
		]);
		\CJSCore::Init(array('jquery','ab_html_edit'));
	}
}