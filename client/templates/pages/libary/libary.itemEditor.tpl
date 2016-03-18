<div class="head">
    <label for="edit_icon">edit</label>
    <div class="edit_icon"></div>
</div>

<% if (type === 'video') { %>
    <% if (urlIframe !== undefined) { %>
        <iframe src="<%= urlIframe %>" width="500px" height="460px" allowfullscreen></iframe>
    <% } %>
<% } %>

<% if (type === 'image') { %>
    <img src="<%= urlCache %>" width="500px"></img>
<% } %>

<% if (type !== 'image' && type !== 'video') { %>
<h4 class="editItem name headline">
    <input readonly=true value="<%= name %>">
</h4>
<% } %>

<div class="editItem url">
    <label>URL</label>
    <input readonly=true value="<%= url %>">
</div>
<div class="editItem description">
    <label>Description</label>
    <textarea readonly=true><%= description %></textarea>
</div>

<a class="remove" href="#">remove</a>

