<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
{
    DB::statement("ALTER TABLE users MODIFY role VARCHAR(255) DEFAULT 'author'");
    DB::statement("UPDATE users SET role = 'author' WHERE role = 'user'");
    DB::statement("ALTER TABLE users MODIFY role ENUM('author', 'admin') NOT NULL DEFAULT 'author'");
}


    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('author')->change();
        });
    }
};
