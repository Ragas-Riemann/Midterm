<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PostController;

Route::get('/', function () {
    return view('welcome'); // make sure the file is welcome.blade.php
    
}); 
Route::prefix('api')->group(function () {
    Route::apiResource('posts', PostController::class);
});
