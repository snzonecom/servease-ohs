<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceCategory;


class ServiceCategoryController extends Controller
{
    public function index()
    {
        $servicecategory = ServiceCategory::getAllServiceCategory();
        return response()->json($servicecategory); 
    }
}
