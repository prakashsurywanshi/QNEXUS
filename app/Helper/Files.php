<?php

namespace App\Helper;

use Illuminate\Support\Facades\File;

class Files
{
    const UPLOAD_FOLDER = 'user-uploads';
    const IMPORT_FOLDER = 'import-files';
    const REQUIRED_FILE_UPLOAD_SIZE = 20;

    public static function generateNewFileName($currentFileName)
    {
        $ext = strtolower(File::extension($currentFileName));
        $newName = md5(microtime());

        return ($ext === '') ? $newName : $newName . '.' . $ext;
    }

    public static function createDirectoryIfNotExist($folder)
    {
        $directoryPath = public_path(self::UPLOAD_FOLDER . '/' . $folder);

        if (!File::exists($directoryPath)) {
            File::makeDirectory($directoryPath, 0775, true);
        }
    }

    public static function returnBytes($val)
    {
        $val = trim($val);
        $valNew = substr($val, 0, -1);
        $last = strtolower($val[strlen($val) - 1]);

        switch ($last) {
            case 'g':
                $valNew *= 1024;
                // no break
            case 'm':
                $valNew *= 1024;
                // no break
            case 'k':
                $valNew *= 1024;
        }

        return $valNew;
    }
}