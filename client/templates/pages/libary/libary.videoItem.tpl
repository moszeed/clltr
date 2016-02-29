<% if (previewImageUrl) { %>
<div class="loader">
    <img src="./images/ajax-loader.gif" data-src="<%= previewImageUrl %>">
    <div class="name">
        <span class="hint">loading Video from Source:&nbsp;</span>
        <span><%= name_truncated%></span></div>
</div>
<% } else { %>
<video controls loop preload=metadata>
    <source src="<%= urlCache %>"></source>
    <source src="<%= url %>"></source>
    Your browser does not support the video tag.
</video>
<% } %>
