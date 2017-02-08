<?php
/**
 * Created by OOO 1C-SOFT.
 * User: dremin_s
 * Date: 28.11.2016
 */

namespace Ab\Tools\Helpers;

use Bitrix\Main\Text\Converter;
use Bitrix\Main\Type;

class DateFetchConverter extends Converter
{
	public function encode($text, $textType = "")
	{
		if($text instanceof Type\DateTime || $text instanceof \DateTime){
			$text = $text->format('d.m.Y H:i:s');
		} elseif ($text instanceof Type\Date){
			$text = $text->format('d.m.Y');
		}

		return $text;
	}

	public function decode($text, $textType = "")
	{
		// TODO: Implement decode() method.
	}

}