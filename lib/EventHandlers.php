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
}