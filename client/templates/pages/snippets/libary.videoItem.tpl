
<% if (previewImageUrl) { %>
<div class="loader">
    <img src="./images/ajax-loader.gif" data-src="<%= previewImageUrl %>">
    <div class="name">
        <span class="hint">loading Video from Source:&nbsp;</span>
        <span><%= name_truncated%></span></div>
</div>
<% } else { %>
<video class="content" src="<%= url %>"></video>
<% } %>
<div class="name"><%= name%></div>

<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
