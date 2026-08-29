<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
config(['database.connections.mariadb.database'=>'qnexus_testing']);
DB::purge('mariadb'); DB::reconnect('mariadb');
echo "connected=".DB::connection()->getDatabaseName()."\n";
\Artisan::call('migrate:fresh',['--database'=>'mariadb','--force'=>true]);
$c=collect(DB::select('SHOW COLUMNS FROM tickets'))->where('Field','agent_id')->first();
echo "agent_id nullable=".$c->Null."\n";
