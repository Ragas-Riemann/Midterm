<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PostController;

Route::apiResource('posts', PostController::class);
