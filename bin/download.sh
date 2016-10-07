#!/bin/bash

curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_bdpm.txt" > data/CIS_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_CIP_bdpm.txt" > data/CIS_CIP_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_COMPO_bdpm.txt" > data/CIS_COMPO_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_HAS_SMR_bdpm.txt" > data/CIS_HAS_SMR_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_HAS_ASMR_bdpm.txt" > data/CIS_HAS_ASMR_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=HAS_LiensPageCT_bdpm.txt" > data/HAS_LiensPageCT_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_GENER_bdpm.txt" > data/CIS_GENER_bdpm.txt
curl "http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_CPD_bdpm.txt" > data/CIS_CPD_bdpm.txt

echo "Téléchargement terminé"
