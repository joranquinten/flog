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
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' SELECT camera_id, type, name, filepattern ';
        $sql .= ' FROM ';
        $sql .= '   cameras ';
        $sql .= ' WHERE 1 ';
        $sql .= ' ORDER BY name ASC ';
        $sql .= ' ; ';

        // Push to array, to print JSON from
        foreach($dbh->query($sql) as $row) {
            $item = array(
                        'camera_id' => $row[0],
                        'type' => $row[1],
                        'name' => $row[2],
                        'filepattern' => $row[3]
            );
            array_push($items, $item);
        }


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
    ),
    'cameras' => $items
);

echo json_encode($response);
?>




