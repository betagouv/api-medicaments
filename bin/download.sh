#!/bin/bash

dlr="curl -s ";
url="http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=";
dirTarget="./data/";

CIS="CIS_bdpm.txt";
CIS_CIP="CIS_CIP_bdpm.txt";
CIS_COMPO="CIS_COMPO_bdpm.txt";
CIS_HAS_SMR="CIS_HAS_SMR_bdpm.txt";
CIS_HAS_ASMR="CIS_HAS_ASMR_bdpm.txt";
HAS_LiensPageCT="HAS_LiensPageCT_bdpm.txt";
CIS_GENER="CIS_GENER_bdpm.txt";
CIS_CPD="CIS_CPD_bdpm.txt";
CIS_InfoImportantes="CIS_InfoImportantes.txt";

function dl(){
    local filename="$1";
    local charsetConverter="iconv -f iso8859-1 -t utf-8";
    echo "Download $filename ...";
    $($dlr $url$filename | $charsetConverter > $dirTarget$filename);
}

if [ -d "$dirTarget" ]; then
    echo "Download directory is $dirTarget";
else
    echo "Create $dirTarget directory";
    mkdir -p $dirTarget;
fi

dl $CIS;
dl $CIS_CIP;
dl $CIS_COMPO;
dl $CIS_HAS_SMR;
dl $CIS_HAS_ASMR;
dl $HAS_LiensPageCT;
dl $CIS_GENER;
dl $CIS_CPD;
dl $CIS_InfoImportantes;

