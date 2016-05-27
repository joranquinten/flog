<?php

// Headers
    session_start();
    date_default_timezone_set('Europe/Amsterdam');
    header('Content-Type: application/json');

// Start timer
    $time = microtime();
    $time = explode(' ', $time);
    $time = $time[1] + $time[0];
    $start = $time;


// Get the data

    $items = array();
    
	// Read data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);
	
    $snap_ids = implode(',',$data['ids']);
	
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' DELETE ';
        $sql .= ' FROM ';
        $sql .= '   snaps ';
        $sql .= ' WHERE snap_id IN ('. $snap_ids .') ';
        $sql .= ' ; ';

        // Push to array, to print JSON from
        $dbh->query($sql);

        $dbh = null;

        $success = true;

    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }

// Stop timer
    $time = microtime();
    $time = explode(' ', $time);
    $time = $time[1] + $time[0];
    $finish = $time;
    $total_time = round(($finish - $start), 4);

// Generate readebly result
$response = array(
    'meta' => array(
        'code' => 200,
        'response_time' => array(
            'time' => $total_time,
            'measure' => 'seconds'
            )
        ),
    'result' => array(
        'success' => true
    )
);

echo json_encode($response);
?>




