<?php
	$array = [
		"1"=>"Andrea",
		"2"=>"Basico",
		"3"=>"Rudo",
		"4"=>"Loco",
		"5"=>"Demo",
		"6"=>"Cralo",
		"7"=>"Zen",
		"8"=>"Rubica"
	];
	$q = $_POST['q'];
	$elem2 = [];
	foreach($array as $key=>$value){
		if($q == "" || stristr($value,$q) !== FALSE ){
			$elem2[$key] = $value;
		}
	}
	echo json_encode(["elements"=>$elem2]);
?>