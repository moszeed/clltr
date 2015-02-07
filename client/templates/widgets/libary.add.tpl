<h2>Add Item</h2>

<div class="url_bar">
    <img src="<%= favicon_url %>">
    <input class="url" placeholder="url" value="<%= url%>">
</div>

<div class="page_data">
    <input class="name" placeholder="name" value="<%= name%>">
    <textarea class="description" placeholder="description"><%= description%></textarea>
</div>

<div id="listing"></div>
<div id="tagging"></div>


<% if (images && images.length !== 0) { %>
<div id="images">
    <h3>select preview image</h3>
    <% _.each(images, function(image) { %>
        <img src="<%= image.url%>">
    <% }); %>
</div>
<% } %>

<div id="buttons">
    <button class="save">add</button>
    <button class="close">decline</button>
</div>
