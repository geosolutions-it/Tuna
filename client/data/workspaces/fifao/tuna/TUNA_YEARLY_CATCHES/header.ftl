<#-- 
Header section of the GetFeatureInfo HTML output. Should have the <head> section, and
a starter of the <body>. It is advised that eventual css uses a special class for featureInfo,
since the generated HTML may blend with another page changing its aspect when usign generic classes
like td, tr, and so on. 
-->
<html>
  <head>
    <title>Geoserver GetFeatureInfo output</title>
  </head>
  <style type="text/css">
          table.featureInfo, table.featureInfo td, table.featureInfo th {
                  border:1px solid #15428B; 
                  margin:0; 
                  padding:0; 
                  font-size: 12px; 
                  /*padding:.1em .1em; */
          }
          
          table.featureInfo th{
                  padding:.2em .2em; 
                  /*text-transform:lowercase;*/
                  color:#fff; 
                  font-weight:bold; 
                  font-size: 12px; 
                  background:#15428B; 
          }
          
          table.featureInfo td{
                  background:#fff; 
                  font-size: 12px; 
          }
          
          table.featureInfo tr.odd td{
                  background:#CEDFF5; 
                  font-size: 12px; 
          }
          
          table.featureInfo caption{
                  text-align:left; 
                  font-size:100%; 
                  font-weight:bold; 
                  text-transform:lowercase;
                  padding:.2em .2em; 
          }
  </style>
  <body>
