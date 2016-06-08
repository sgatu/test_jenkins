<div>
<table>
	<thead>
		<tr>
			<td>Id</td>
			<td>Name</td>
		</tr>
	</thead>
	<tbody>
		<% for(var id in data.elements){ %>
			<tr class='item'><td><%= id %></td><td><%= data.elements[id] %></td></tr>
		<% } %>
	</tbody>
</table>
</div>