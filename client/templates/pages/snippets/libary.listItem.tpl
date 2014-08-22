<div class="top_lane">
    <div class="favicon"><img></div>
    <div class="name"><%= name%></div>
    <div class="url"><a target="_blank" href="<%= url%>"><%= url%></a></div>
</div>
<div class="info_lane">
    <div class="created"><%= dateFormated %></div>
    <div class="tags">
        <% _.each(tags, function(tag, key) { %>

            <span class="<%= key%>"><%= tag%> <span class="delete">x</span></span>
        <% }); %>
    </div>
    <div class="addTag">add</div>
</div>
<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
<div class="description"><%= description%></div>