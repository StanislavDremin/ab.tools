<?php
/**
 * Created by PhpStorm.
 * User: dremin_s
 * Date: 15.08.2016
 * Time: 12:27
 */

namespace AB\Tools\Rest;

use \Exception;

class RestException extends Exception
{
	/**
	 * RestException constructor.
	 *
	 * @param string $message
	 * @param int $code
	 * @param Exception $previous
	 */
	public function __construct($message, $code = 1000, Exception $previous = null)
	{
		parent::__construct($message, $code, $previous);
	}

	/**
	 * @method __toString
	 */
	public function __toString()
	{
		parent::__toString();
	}

}