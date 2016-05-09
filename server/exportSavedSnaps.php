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
	
	$snap_ids = '';
	if ($data['ids']) {
		$snap_ids = implode(',', $data['ids']);
	}
	
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' SELECT snap_id, file_name, focal_distance, aperture_size, file_date, lat, lng, notes ';
        $sql .= ' FROM ';
        $sql .= '   snaps ';
        $sql .= ' WHERE 1 ';
		if ($snap_ids !== '') {
			$sql .= ' AND snap_id IN ('. $snap_ids .') ';
		}
        $sql .= ' ORDER BY file_date ASC ';
        $sql .= ' ; ';

        // Push to array, to print JSON from
        foreach($dbh->query($sql) as $row) {
            $item = array(
                        'id' => $row[0],
                        'fileName' => $row[1],
                        'focalDistance' => $row[2],
                        'apertureSize' => $row[3],
                        'fileDate' => $row[4],
                        'locationLat' => $row[5],
                        'locationLong' => $row[6],
                        'snapNotes' => $row[7]
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

	

download_send_headers("data_export_" . date("Y-m-d") . ".csv");
echo array2csv($items);
die();

function array2csv(array &$array)
{
   if (count($array) == 0) {
     return null;
   }
   ob_start();
   $df = fopen("php://output", 'w');
   fputcsv($df, array_keys(reset($array)));
   foreach ($array as $row) {
      fputcsv($df, $row);
   }
   fclose($df);
   return ob_get_clean();
}

function download_send_headers($filename) {
    // disable caching
    $now = gmdate("D, d M Y H:i:s");
    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
    header("Last-Modified: {$now} GMT");

    // force download  
    header("Content-Type: application/force-download");
    header("Content-Type: application/octet-stream");
    header("Content-Type: application/download");

    // disposition / encoding on response body
    header("Content-Disposition: attachment;filename={$filename}");
    header("Content-Transfer-Encoding: binary");
}
?>




