<?php
/**
 * Created by OOO 1C-SOFT.
 * User: dremin_s
 * Date: 23.01.2017
 */

namespace AB\Tools;

use Bitrix\Main\Text\Encoding;

/**
 * Class Debug
 * @package Esd
 */
class Debug extends \Bitrix\Main\Diag\Debug
{
	private static $time;
	private static $memory;
	private static $sql;

	public static function convertTranslitMetric($data)
	{
		return \CUtil::translit($data, 'ru', ['replace_space'=> ' ', 'change_case' => false, 'safe_chars' => '.,']);
	}

	/**
	 * @method getMemory - get param memory
	 * @param bool $flag
	 * @param bool $show
	 * @return mixed
	 */
	public static function getMemory($flag = false, $show = false)
	{
		if(self::$memory && !is_null(self::$memory)){
			$endMemory = memory_get_usage() - self::$memory;
		} else {
			$endMemory = memory_get_usage($flag);
		}

		$out = self::convertTranslitMetric(\CFile::FormatSize($endMemory));

		if($show){
			PR($out);
		} else {
			return $out;
		}
	}

	public static function startMemory()
	{
		self::$memory = memory_get_usage();
//		self::$memory = $start;
	}

	/**
	 * @method getSql
	 * @param object $obj
	 * @param bool $show
	 * @return mixed
	 */
	public static function getSql($obj, $show = true)
	{
		if(class_exists(array($obj, 'getTrackerQuery')))
			self::$sql = $obj->getTrackerQuery()->getSql();

		\Bitrix\Main\Application::getConnection()->stopTracker();
		if($show)
			PR(\Bitrix\Main\Application::getConnection()->getTracker());
		else
			self::$sql = \Bitrix\Main\Application::getConnection()->getTracker();

		return self::$sql;
	}

	/**
	 * @method startSql
	 */
	public static function startSql()
	{
		\Bitrix\Main\Application::getConnection()->startTracker(true);
	}


	public static function getTime($show = false)
	{
		$time = round(\getmicrotime() - self::$time, 4);
		if($show)
			PR($time);

		return $time;
	}

	/**
	 * @method startTime
	 */
	public static function startTime()
	{
		self::$time = \getmicrotime();
	}


	/**
	 * @method hlLog - запись отладки в лог
	 * @param $sText mixed - текст отладки
	 * @param $pathLog bool - путь к файлу лога (по дефолту /HL_lg.txt)
	 * @param $traceDepth integer
	 * @param $bShowArgs bool
	 * */
	public static function toLog($sText, $pathLog = false, $traceDepth = 10, $bShowArgs = false){
		$mess = print_r($sText, 1);
		$mess = Encoding::convertEncodingToCurrent($mess);
		if(empty($mess))
			$mess = 'EMPTY';

		if(!$pathLog){
			$pathLog = $_SERVER['DOCUMENT_ROOT'].'/local/lg/esd_lg979076ssda.txt';
		}

		if ($fp = @fopen($pathLog, "ab+")){
			@fwrite($fp, "Host: ".$_SERVER["HTTP_HOST"]."\nDate: ".date("Y-m-d H:i:s")."\n".$mess."\n");
			$arBacktrace = \Bitrix\Main\Diag\Helper::getBackTrace($traceDepth, ($bShowArgs? null : DEBUG_BACKTRACE_IGNORE_ARGS));
			$strFunctionStack = "";
			$strFilesStack = "";
			$iterationsCount = min(count($arBacktrace), $traceDepth);
			for ($i = 1; $i < $iterationsCount; $i++)
			{
				if (strlen($strFunctionStack)>0)
					$strFunctionStack .= " < ";

				if (isset($arBacktrace[$i]["class"]))
					$strFunctionStack .= $arBacktrace[$i]["class"]."::";

				$strFunctionStack .= $arBacktrace[$i]["function"];

				if(isset($arBacktrace[$i]["file"]))
					$strFilesStack .= "\t".$arBacktrace[$i]["file"].":".$arBacktrace[$i]["line"]."\n";
				if($bShowArgs && isset($arBacktrace[$i]["args"]))
				{
					$strFilesStack .= "\t\t";
					if (isset($arBacktrace[$i]["class"]))
						$strFilesStack .= $arBacktrace[$i]["class"]."::";
					$strFilesStack .= $arBacktrace[$i]["function"];
					$strFilesStack .= "(\n";
					foreach($arBacktrace[$i]["args"] as $value)
						$strFilesStack .= "\t\t\t".$value."\n";
					$strFilesStack .= "\t\t)\n";

				}
			}

			if (strlen($strFunctionStack)>0)
			{
				@fwrite($fp, "    ".$strFunctionStack."\n".$strFilesStack);
			}

			@fwrite($fp, "----------\n");
			@fflush($fp);
			@flock($fp, LOCK_UN);
			@fclose($fp);
		}
	}
}