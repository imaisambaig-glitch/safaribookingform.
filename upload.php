<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid method']);
    exit;
}

$targetDir = 'uploads/';
$maxSize = 2 * 1024 * 1024; // 2MB
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (isset($_FILES['paymentScreenshot']) && $_FILES['paymentScreenshot']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['paymentScreenshot'];
    $fileType = mime_content_type($file['tmp_name']);
    
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['error' => 'Only JPG, JPEG, PNG allowed']);
        exit;
    }
    
    if ($file['size'] > $maxSize) {
        echo json_encode(['error' => 'File too large (max 2MB)']);
        exit;
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = time() . '_' . uniqid() . '.' . $extension;
    $targetPath = $targetDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Collect form data
        $data = [
            'name' => $_POST['guestName'],
            'email' => $_POST['guestEmail'],
            'phone' => $_POST['guestPhone'],
            'cnic' => $_POST['cnic'],
            'address' => $_POST['address'],
            'checkIn' => $_POST['checkIn'],
            'checkOut' => $_POST['checkOut'],
            'guests' => $_POST['numGuests'],
            'room' => $_POST['roomType'],
            'requests' => $_POST['specialRequests'],
            'paymentImage' => $targetPath
        ];
        
        // TODO: EmailJS or mail() here
        echo json_encode(['success' => true, 'image' => $filename, 'data' => $data]);
    } else {
        echo json_encode(['error' => 'Upload failed']);
    }
} else {
    echo json_encode(['error' => 'No file uploaded']);
}
?>

