<?php
/**
 * Created by PhpStorm.
 * User: dremin_s
 * Date: 01.11.2016
 * Time: 17:53
 */

namespace AB\Tools\Helpers;


class FormIblock
{
	protected static $ibFields = [
		'NAME' => [
			'NAME' => 'Название',
			'CODE' => 'NAME',
			'SORT' => 100500,
			'REQUIRED' => 'Y'
		],
		'CODE' => [
			'NAME' => 'Код',
			'CODE' => 'CODE',
			'SORT' => 100510,
		],
		'PREVIEW_TEXT' => [
			'NAME' => 'Сообщение',
			'CODE' => 'PREVIEW_TEXT',
			'SORT' => 100520,
		],
		'DETAIL_TEXT' => [
			'NAME' => 'Детальное описание',
			'CODE' => 'DETAIL_TEXT',
			'SORT' => 100530,
		],
		'PREVIEW_PICTURE' => [
			'NAME' => 'Фото',
			'CODE' => 'PREVIEW_PICTURE',
			'SORT' => 100540,
		],
		'DETAIL_PICTURE' => [
			'NAME' => 'Детальное фото',
			'CODE' => 'DETAIL_PICTURE',
			'SORT' => 100550,
		],
	];

	/**
	 * @method getIbFields - get param ibFields
	 * @param $field
	 *
	 * @return array
	 */
	public static function getIbFields($field = '')
	{
		if(isset(self::$ibFields[$field]))
			return self::$ibFields[$field];

		return self::$ibFields;
	}

	public static function encodeParams(array $arParams = [])
	{
		global $LICENSE_KEY;

		return base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($LICENSE_KEY), serialize($arParams), MCRYPT_MODE_CBC, md5(md5($LICENSE_KEY))));
	}

	public static function decodeParams($arParams)
	{
		global $LICENSE_KEY;
		$res = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($LICENSE_KEY), base64_decode($arParams), MCRYPT_MODE_CBC, md5(md5($LICENSE_KEY)));

		return unserialize($res);
	}
}