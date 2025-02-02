<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceCategory;


class ServiceCategoryController extends Controller
{
    // Get All Categories
    public function index()
    {
        $serviceCategories = ServiceCategory::all();
        return response()->json($serviceCategories);
    }

    // Create New Category
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_name' => 'required|string|max:255',
            'category_description' => 'nullable|string',
        ]);

        $category = ServiceCategory::create($validatedData);
        return response()->json($category, 201);
    }

    // Update a Category
    public function update(Request $request, $id)
    {
        $category = ServiceCategory::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validatedData = $request->validate([
            'category_name' => 'required|string|max:255',
            'category_description' => 'nullable|string',
        ]);

        $category->update($validatedData);
        return response()->json($category);
    }

    // Delete a Category
    public function destroy($id)
    {
        $category = ServiceCategory::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    // Show the count of categories
    public function getCategoryCount()
    {
        $categoryCount = ServiceCategory::count();
        return response()->json(['totalCategories' => $categoryCount]);
    }

    // Will get the categories for service provider registration
    public function getCategories()
    {
        return response()->json(ServiceCategory::all());
    }
}
