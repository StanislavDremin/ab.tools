<?php
/**
 * Created by PhpStorm.
 * User: dremin_s
 * Date: 15.08.2016
 * Time: 12:59
 */

namespace AB\Tools\Rest;

use Bitrix\Main\Type\Dictionary;

class Router
{
	/** @var  Dictionary */
	protected static $routes;

	/** @var Router */
	private static $instance = null;

	/**
	 * @method instance
	 * @return Router
	 */
	public static function instance()
	{
		if(is_null(self::$instance)){
			self::$instance = new static();
			self::$routes = new Dictionary();
		}

		return self::$instance;
	}

	/**
	 * @method addRoute
	 * @param $params
	 * @param $url
	 *
	 * @return Router
	 */
	public function addRoute($params, $url = false)
	{
		if(strlen($url) > 0 && substr($url, 0, 1) != '/'){
			$url = '/'.$url;
		}
		self::$routes->offsetSet($url, $params);

		return $this;
	}

	/**
	 * @method getRoute
	 * @param $k
	 *
	 * @return null|mixed
	 */
	public function getRoute($k)
	{
		if(substr($k, 0, 1) != '/'){
			$k = '/'.$k;
		}
		return self::$routes->get($k);
	}

	/**
	 * @method getRoutes - get param routes
	 * @return Dictionary
	 */
	public static function getRoutes()
	{
		return self::$routes;
	}


}