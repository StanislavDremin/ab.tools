<?php
/**
 * Created by OOO 1C-SOFT.
 * User: teacher
 * Date: 25.11.16
 */

namespace AB\Tools\Console;


class ProgressBar
{

	/**
	 * @method pre
	 * @param $data
	 */
	public static function pre($data)
	{
		echo "\r\n";
		if(!empty($data))
			print_r($data);
		else
			echo 'EMPTY';
		echo "\r\n";
	}

	/**
	 * @method showGood
	 * @param $msg
	 * @param $b
	 */
	public static function showGood($msg, $b = false){
		echo "\r\n";
		echo "\x1b[32".($b ? ';1': false)."m".$msg."\x1b[0m";
		echo "\r\n";
	}

	/**
	 * @method showError
	 * @param $msg
	 */
	public static function showError($msg)
	{
		echo "\r\n";
		echo "\x1b[31mERROR: ".$msg."\x1b[0m\n";
		echo "\r\n";
	}

	public static function consoleLog($msg = '')
	{
		echo "\r\n";
		echo $msg;
		echo "\r\n";
	}

}