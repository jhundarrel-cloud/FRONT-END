<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminSanctumController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\Api\Coordinator\CoordinatorController;
use App\Http\Controllers\Api\Beneficiary\BeneficiaryAuthController;
use App\Http\Controllers\Api\BeneficiaryDetailsController;
use App\Http\Controllers\Api\FarmProfileController;
use App\Http\Controllers\Api\FarmParcelController;
use App\Http\Controllers\Api\BeneficiaryLivelihoodController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\RsbsaEnrollmentController;
use App\Http\Controllers\Api\ReferenceDataController;
use App\Http\Controllers\Api\CoordinatorBeneficiaryController;
use App\Http\Controllers\Api\EnrollmentInterviewController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\InventoryStockController;
use App\Http\Controllers\Api\SubsidyProgramController;
use App\Http\Controllers\Api\SubsidyAnalyticsController; 
use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\CoordinatorAnalyticsController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\BeneficiaryController;
use App\Http\Controllers\Api\StockListController;
use App\Http\Controllers\Api\BeneficiaryDashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ServiceCatalogController;
use App\Http\Controllers\Api\ServiceEventController;
use App\Http\Controllers\Api\ServiceBeneficiaryController;
use App\Http\Controllers\Api\ServiceEventStockController;

// ==================== PUBLIC ROUTES (NO AUTHENTICATION) ====================

// Admin public routes
Route::post('/admin/login', [AdminSanctumController::class, 'login']);
Route::post('/admin/register', [AdminSanctumController::class, 'register']);

// Coordinator public routes
Route::post('/coordinator/login', [CoordinatorController::class, 'login']);
Route::post('/coordinator/forgot-password', [CoordinatorController::class, 'forgotPassword']);
Route::post('/coordinator/reset-password', [CoordinatorController::class, 'resetPasswordWithToken']);

// Beneficiary public routes
Route::post('/beneficiary/register', [BeneficiaryAuthController::class, 'store']);
Route::post('/beneficiary/login', [BeneficiaryAuthController::class, 'login']);
Route::get('/beneficiary/check-availability', [BeneficiaryAuthController::class, 'checkAvailability']);
Route::post('/beneficiary/forgot-password', [BeneficiaryAuthController::class, 'sendResetLinkEmail']);
Route::post('/beneficiary/reset-password', [BeneficiaryAuthController::class, 'resetPassword']);

// Public reference data
Route::get('/rsbsa/livelihood-categories', [ReferenceDataController::class, 'getLivelihoodCategories']);

// ==================== PROTECTED ROUTES (REQUIRE AUTHENTICATION) ====================
Route::middleware('auth:sanctum')->group(function () {
    
    // Me endpoint
    Route::get('/user', fn (Request $request) => $request->user());
    
    // Notifications (dynamic)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    });
    
    // Enrollment Interview routes
    Route::prefix('rsbsa/enrollments')->group(function () {
        Route::post('/{enrollmentId}/interview/complete', [EnrollmentInterviewController::class, 'completeInterview']);
    });
    
    // Authenticated admin/beneficiary actions
    Route::post('/admin/logout', [AdminSanctumController::class, 'logout']);
    Route::post('/beneficiary/logout', [BeneficiaryAuthController::class, 'logout']);
    Route::put('/user/change-password', [BeneficiaryAuthController::class, 'changePassword']);

    // Sectors
    Route::get('/sectors/check-name', [SectorController::class, 'checkName']);
    Route::get('/sectors/with-trashed', [SectorController::class, 'allWithTrashed']);
    Route::get('/sectors/summary', [SectorController::class, 'getSectorSummary']);
    Route::apiResource('sectors', SectorController::class);
    Route::get('/sectors/{id}/coordinators-beneficiaries', [SectorController::class, 'getCoordinatorsWithBeneficiaries']);
    Route::post('/sectors/{id}/restore', [SectorController::class, 'restore']);
        
    Route::get('/coordinators', [CoordinatorController::class, 'index']);
    Route::post('/coordinators', [CoordinatorController::class, 'store']);
    Route::post('/coordinator/change-password', [CoordinatorController::class, 'resetPassword']);
    Route::post('/coordinator/force-reset-password', [CoordinatorController::class, 'forceResetPassword']);
    Route::put('/coordinators/{id}', [CoordinatorController::class, 'update']);

    // -------------------- INVENTORY MANAGEMENT --------------------

    // Inventory master items
    Route::prefix('inventory')->group(function () {
        Route::get('/items', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/items', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/items/{id}', [InventoryController::class, 'show'])->name('inventory.show');
        Route::put('/items/{id}', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/items/{id}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
        
        // Stock management
        Route::get('/stocks', [StockListController::class, 'index'])->name('stocks.index');
        Route::post('/stocks', [StockListController::class, 'store'])->name('stocks.store');
        Route::get('/stocks/{id}', [StockListController::class, 'show'])->name('stocks.show');
        Route::put('/stocks/{id}', [StockListController::class, 'update'])->name('stocks.update');
        Route::put('/stocks/{id}/verify', [StockListController::class, 'verify'])->name('stocks.verify');
        Route::delete('/stocks/{id}', [StockListController::class, 'destroy'])->name('stocks.destroy');
        Route::get('/stocks/check/{inventoryId}/{quantity}', [StockListController::class, 'checkStockAvailability']);
        
        // ✅ FIXED: Use correct controller and method
        Route::get('/available-stocks', [StockListController::class, 'getAvailableStocks']);
    });

    // Subsidy Programs
    Route::prefix('subsidy-programs')->group(function () {
        Route::get('/my-programs', [SubsidyProgramController::class, 'myBeneficiaryPrograms']);
        Route::get('/my-programs/{id}', [SubsidyProgramController::class, 'myBeneficiaryProgramDetails']);
        Route::get('/my-beneficiary-subsidy-history', [SubsidyProgramController::class, 'myBeneficiarySubsidyHistory']);
        
        // Coordinator history
        Route::get('/history', [SubsidyProgramController::class, 'history']);
        
        // Admin/Coordinator CRUD routes
        Route::get('/', [SubsidyProgramController::class, 'index']);
        Route::post('/', [SubsidyProgramController::class, 'store']);
        // Custom actions with specific IDs
        Route::post('/{id}/approve', [SubsidyProgramController::class, 'approveProgram']);
        Route::post('/{id}/cancel', [SubsidyProgramController::class, 'cancelProgram']);
        Route::post('/{id}/complete', [SubsidyProgramController::class, 'completeProgram']);
        Route::get('/{id}/history-summary', [SubsidyProgramController::class, 'historySummary']);
        // Item distribution management
        Route::post('/items/{itemId}/distribute', [SubsidyProgramController::class, 'confirmDistribution']);
        Route::post('/items/{itemId}/unclaim', [SubsidyProgramController::class, 'markItemUnclaimed']);
        // Generic parameter routes LAST
        Route::get('/{id}', [SubsidyProgramController::class, 'show']);
        Route::put('/{id}', [SubsidyProgramController::class, 'update']);
        Route::delete('/{id}', [SubsidyProgramController::class, 'destroy']);
    });

    // Subsidy Analytics Routes
    Route::prefix('analytics')->group(function () {
        Route::get('/programs/{id}', [SubsidyAnalyticsController::class, 'programAnalytics']);
        Route::get('/dashboard', [SubsidyAnalyticsController::class, 'dashboardAnalytics']);
        Route::get('/programs/{id}/beneficiaries', [SubsidyAnalyticsController::class, 'beneficiaryDistributionStatus']);
        Route::get('/programs/{id}/unclaimed', [SubsidyAnalyticsController::class, 'unclaimedItemsReport']);
        Route::get('/programs/{id}/daily-progress', [SubsidyAnalyticsController::class, 'dailyDistributionProgress']);
        Route::get('/programs/{id}/items', [SubsidyAnalyticsController::class, 'itemAnalytics']);
    });

    // -------------------- RSBSA System Routes --------------------
    Route::prefix('rsbsa')->group(function () {
        // Beneficiary Details
        Route::prefix('beneficiary-details')->group(function () {
            Route::get('/', [BeneficiaryDetailsController::class, 'index']);              
            Route::post('/', [BeneficiaryDetailsController::class, 'store']);              
            Route::get('/{id}', [BeneficiaryDetailsController::class, 'show']);            
            Route::put('/{id}', [BeneficiaryDetailsController::class, 'update']);          
            Route::get('/user/{userId}', [BeneficiaryDetailsController::class, 'getByUserId']); 
            Route::get('/check-rsbsa/{rsbsaNumber}', [BeneficiaryDetailsController::class, 'checkRsbsaAvailability']);
            Route::get('/{id}/enrollment-status', [BeneficiaryDetailsController::class, 'checkEnrollmentStatus']);
        });
        
        Route::get('/beneficiaries/{id}/enrollment-status', [BeneficiaryDetailsController::class, 'checkEnrollmentStatus']);
        
        // Admin/Coordinator-only actions for beneficiary management
        Route::middleware(['role:admin,coordinator'])->group(function () {
            Route::get('/beneficiaries', [BeneficiaryDetailsController::class, 'index']);
            Route::post('/beneficiary-details/{userId}/verify', [BeneficiaryDetailsController::class, 'verify']);
            Route::post('/beneficiary-details/{userId}/reject', [BeneficiaryDetailsController::class, 'reject']);
        });

        // Farm Profiles
        Route::prefix('farm-profiles')->group(function () {
            Route::post('/', [FarmProfileController::class, 'store']);
            Route::get('/{id}', [FarmProfileController::class, 'show']);
            Route::put('/{id}', [FarmProfileController::class, 'update']);
        });

        // Farm Parcels (with commodities)
        Route::prefix('farm-parcels')->group(function () {
            Route::post('/', [FarmParcelController::class, 'store']);
            Route::post('/bulk', [FarmParcelController::class, 'storeBulk']);
            Route::get('/farm-profile/{farmProfileId}', [FarmParcelController::class, 'getByFarmProfile']);
            Route::put('/{id}', [FarmParcelController::class, 'update']);
            Route::delete('/{id}', [FarmParcelController::class, 'destroy']);
            Route::get('/user/{userId}', [FarmParcelController::class, 'forUser']);
        });

        // Beneficiary Livelihoods
        Route::prefix('beneficiary-livelihoods')->group(function () {
            Route::post('/', [BeneficiaryLivelihoodController::class, 'store']);
            Route::get('/beneficiary/{beneficiaryId}', [BeneficiaryLivelihoodController::class, 'getByBeneficiary']);
        });

        // Activities
        Route::post('/farmer-activities', [ActivityController::class, 'storeFarmerActivities']);
        Route::post('/fisherfolk-activities', [ActivityController::class, 'storeFisherfolkActivities']);
        Route::post('/farmworker-activities', [ActivityController::class, 'storeFarmworkerActivities']);
        Route::post('/agri-youth-activities', [ActivityController::class, 'storeAgriYouthActivities']);

        // Enrollments (Beneficiary submission + status)
        Route::prefix('enrollments')->group(function () {
            Route::post('/', [RsbsaEnrollmentController::class, 'store']);
            Route::post('/{id}/cancel', [RsbsaEnrollmentController::class, 'cancel']);

            Route::get('/user/{userId}', [RsbsaEnrollmentController::class, 'getByUserId']);
            Route::get('/user/{userId}/application_status', [RsbsaEnrollmentController::class, 'application_status']);
            Route::get('/rsbsa/enrollments/user/{userId}/reference-number', [RsbsaEnrollmentController::class, 'getReferenceNumber']);

            // ---------------- Enrollment Interviews ----------------
            Route::post('{id}/interview/complete', [EnrollmentInterviewController::class, 'complete']);
            Route::get('my-interviews', [EnrollmentInterviewController::class, 'myInterviews']);
            Route::get('/', [EnrollmentInterviewController::class, 'index']);
            Route::get('display', [EnrollmentInterviewController::class, 'adminIndex']); 
            Route::get('history', [EnrollmentInterviewController::class, 'history']);
            Route::post('{id}/approve', [EnrollmentInterviewController::class, 'approve']);
            Route::post('{id}/reject', [EnrollmentInterviewController::class, 'reject']);
            Route::get('{id}/details', [EnrollmentInterviewController::class, 'show']);
            Route::post('{id}/schedule', [EnrollmentInterviewController::class, 'scheduleInterview']);
        });

        // Reference Data
        Route::get('/sectors', [ReferenceDataController::class, 'getSectors']);
        Route::get('/commodity-categories', [ReferenceDataController::class, 'getCommodityCategories']);
        Route::get('/commodities', [ReferenceDataController::class, 'getCommodities']);

        // Beneficiary dashboard endpoints
        Route::prefix('beneficiary/dashboard')->group(function () {
            Route::get('/overview', [BeneficiaryDashboardController::class, 'overview']);
            Route::get('/programs', [BeneficiaryDashboardController::class, 'programs']);
            Route::get('/notifications', [BeneficiaryDashboardController::class, 'notifications']);
        });

        // Coordinator-Beneficiary Assignment
        Route::prefix('coordinator-beneficiaries')->group(function () {
            Route::get('/enrollments', [CoordinatorBeneficiaryController::class, 'enrollmentList']); 
            Route::post('/assign', [CoordinatorBeneficiaryController::class, 'addBeneficiaries']); 
            Route::get('/my-beneficiaries', [CoordinatorBeneficiaryController::class, 'myBeneficiaries']); 
            Route::delete('/{enrollmentId}', [CoordinatorBeneficiaryController::class, 'removeBeneficiary']);
            Route::post('/transfer', [CoordinatorBeneficiaryController::class, 'transferBeneficiaries']);
        });
    }); 

    // Admin analytics
    Route::prefix('admin/analytics')->group(function () {
        Route::get('/dashboard-overview', [AdminAnalyticsController::class, 'dashboardOverview']);
        Route::get('/inventory', [AdminAnalyticsController::class, 'inventoryAnalytics']);
        Route::get('/programs', [AdminAnalyticsController::class, 'programAnalytics']);
        Route::get('/beneficiaries', [AdminAnalyticsController::class, 'beneficiaryAnalytics']);
        Route::get('/financials', [AdminAnalyticsController::class, 'financialAnalytics']);
    });

    // Admin user management routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [BeneficiaryController::class, 'index']);
        Route::get('/users/{userId}', [BeneficiaryController::class, 'show']);
        Route::get('/users/{userId}/subsidies', [BeneficiaryController::class, 'getUserSubsidies']);
        Route::put('/users/{userId}', [BeneficiaryController::class, 'updateUser']);
        Route::put('/users/{userId}/beneficiary', [BeneficiaryController::class, 'updateBeneficiary']);
        Route::patch('/users/{userId}/toggle-status', [BeneficiaryController::class, 'toggleStatus']);
        Route::get('/filter-options', [BeneficiaryController::class, 'getFilterOptions']);
        Route::get('/stats', [BeneficiaryController::class, 'getStats']);
        Route::get('/users/{userId}/farm-details', [BeneficiaryController::class, 'getUserFarmDetails']);

        // RSBSA Number Management Routes (Admin only)
        Route::prefix('rsbsa-numbers')->group(function () {
            Route::get('/beneficiaries', [App\Http\Controllers\Api\Admin\RsbsaNumberController::class, 'getAllBeneficiaries']);
            Route::post('/beneficiaries/{beneficiaryId}/assign', [App\Http\Controllers\Api\Admin\RsbsaNumberController::class, 'assignOfficialRsbsa']);
            Route::put('/beneficiaries/{beneficiaryId}/update', [App\Http\Controllers\Api\Admin\RsbsaNumberController::class, 'updateOfficialRsbsa']);
            Route::get('/check/{rsbsaNumber}', [App\Http\Controllers\Api\Admin\RsbsaNumberController::class, 'checkRsbsaAvailability']);
            Route::get('/bulk-template', [App\Http\Controllers\Api\Admin\RsbsaNumberController::class, 'getBulkAssignmentTemplate']);
        });
    });

    // Coordinator analytics
    Route::get('/coordinator/analytics', [CoordinatorAnalyticsController::class, 'index']);
    
    // Admin Dashboard API
    Route::prefix('admin/dashboard')->group(function () {
        Route::get('/sector-beneficiaries', [AdminDashboardController::class, 'sectorBeneficiaries']);
        Route::get('/coordinator-breakdown', [AdminDashboardController::class, 'coordinatorBreakdown']);
        Route::get('/sector-programs', [AdminDashboardController::class, 'sectorPrograms']); 
        Route::get('/coordinator-performance', [AdminDashboardController::class, 'coordinatorPerformance']);
    });

    Route::get('/test', function () {
        return response()->json(['message' => 'CORS working!']);
    }); 

    // -------------------- SERVICE MANAGEMENT --------------------
    
    // Service Catalogs
    Route::prefix('service-catalogs')->group(function () {
        Route::get('/', [ServiceCatalogController::class, 'index']);
        Route::post('/', [ServiceCatalogController::class, 'store']);
        Route::get('/{id}', [ServiceCatalogController::class, 'show']);
        Route::put('/{id}', [ServiceCatalogController::class, 'update']);
        Route::delete('/{id}', [ServiceCatalogController::class, 'destroy']);
        Route::post('/{id}/toggle-active', [ServiceCatalogController::class, 'toggleActive']);
    });

    // Service Events
    Route::prefix('service-events')->group(function () {
        // Main CRUD
        Route::get('/', [ServiceEventController::class, 'index']);
        Route::post('/', [ServiceEventController::class, 'store']);
        Route::get('/statistics', [ServiceEventController::class, 'statistics']); // Must be before /{id}
        Route::get('/{id}', [ServiceEventController::class, 'show']);
        Route::put('/{id}', [ServiceEventController::class, 'update']);
        Route::delete('/{id}', [ServiceEventController::class, 'destroy']);
        
        // Status Management
        Route::post('/{id}/mark-scheduled', [ServiceEventController::class, 'markAsScheduled']);
        Route::post('/{id}/mark-completed', [ServiceEventController::class, 'markAsCompleted']);
        Route::post('/{id}/cancel', [ServiceEventController::class, 'cancel']);
        // ✅ REMOVED: uploadDocuments method doesn't exist in ServiceEventController
        
        // Beneficiaries Management
        Route::get('/{event}/beneficiaries', [ServiceBeneficiaryController::class, 'index']);
        Route::post('/{event}/beneficiaries', [ServiceBeneficiaryController::class, 'store']);
        Route::post('/{event}/beneficiaries/bulk', [ServiceBeneficiaryController::class, 'bulkStore']);
        Route::get('/{event}/beneficiaries/statistics', [ServiceBeneficiaryController::class, 'statistics']);
        Route::put('/{event}/beneficiaries/{id}', [ServiceBeneficiaryController::class, 'update']);
        Route::patch('/{event}/beneficiaries/{id}', [ServiceBeneficiaryController::class, 'update']);
        Route::delete('/{event}/beneficiaries/{id}', [ServiceBeneficiaryController::class, 'destroy']);
        Route::post('/{event}/beneficiaries/{id}/mark-provided', [ServiceBeneficiaryController::class, 'markAsProvided']);
        Route::post('/{event}/beneficiaries/{id}/mark-cancelled', [ServiceBeneficiaryController::class, 'markAsCancelled']);
        
        // Stocks Management
        Route::get('/{event}/stocks', [ServiceEventStockController::class, 'index']);
        Route::post('/{event}/stocks', [ServiceEventStockController::class, 'store']);
        Route::delete('/{event}/stocks/{id}', [ServiceEventStockController::class, 'destroy']);
    });

    // Service-related Inventory Stocks (moved to correct location)
    Route::get('/service-inventory/available-stocks', [StockListController::class, 'getAvailableStocks']);
});