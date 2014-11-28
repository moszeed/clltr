
<div class="name" title="<%= dateFormated %>"><%= name%></div>
<div class="tags">
    <% _.each(tags, function(tag, key) { %>
        <div class="<%= key%> tag">
            <span class="delete">x</span>
            <span class="value"><%= tag%></span>
        </div>
    <% }); %>
    <div class="addTag">&#43;</div>
</div>
<div class="description"><%= description%></div>
<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
