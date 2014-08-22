<h2>TagItem</h2>
<div class="data">

	<div class="possible_tags">
    	<select>
            <option value=null selected="selected">select a tag</option>
        	<% _.each(tags, function(model) { %>
                <% if (_.indexOf(attrs.tags, model.attributes.name) === -1 && model.attributes.name !== 'all') { %>
        	       <option value="<%= model.attributes.name %>"><%= model.attributes.name %></option>
        	   <% } %>
            <% }); %>
    	</select>
	</div>

	<div class="new_tag">
		<input placeholder="create a tag">
	</div>
</div>
<div>
    <button class="set">set tag</button>
    <button class="close">close</button>
</div>