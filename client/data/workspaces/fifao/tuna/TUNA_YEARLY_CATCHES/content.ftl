<#-- 
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<table class="featureInfo" cellpadding="0" cellspacing="0">
  <tr>
<#list type.attributes as attribute>
  <#if !attribute.isGeometry>
	<#if attribute.name == 'TS_VALUE'>
		<th>Aggregated catches</th>
	</#if>
	<#if attribute.name == 'CD_TA_OCEANAREA'>
		<th>Cell code</th>
	</#if>
  </#if>
</#list>
  </tr>

<#assign odd = false>
<#list features as feature>
  <#if odd>
    <tr class="odd">
  <#else>
    <tr>
  </#if>
  <#assign odd = !odd>
    
  <#list feature.attributes as attribute>
    <#if !attribute.isGeometry>
		<#if attribute.name=='TS_VALUE'>
			 <td>${attribute.value?number?string("0.###")}</td> 
			
		<#else>
			<td>${attribute.value}</td>
		</#if>
    </#if>
  </#list>
  </tr>
</#list>
</table>
<br/>
