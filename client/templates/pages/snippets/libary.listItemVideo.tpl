<div class="name"><%= name%></div>
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


<div class="tags">
    <% _.each(tags, function(tag, key) { %>
        <div class="<%= key%> tag">
            <span class="delete">x</span>
            <span class="value"><%= tag%></span>
        </div>
    <% }); %>
    <button class="addTag">&#43; add Tag</button>
</div>

<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
