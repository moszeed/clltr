<div class="tags">
    <% if (tagList) { %>
    <select>
        <option value=null>add Tag to Bookmark</option>
        <% _.each(tagList, function(tag) { %>
        <option value="<%= tag.name%>"><%= tag.name%></option>
        <% }) %>
    </select>
    <span><a>new tag</a></span>
    <div class="add_new">
        <input type="text" placeholder="enter new tag name">
        <button class="addTag">new Tag</button>
        <hr>
    </div>
    <% } %>
    <div class="currentTags">
    <div>current tags:</div>
    <% _.each(currentTags, function(tagItem) { %>
        <div>
            <span><%= tagItem%></span>
            <button>x</button>
        </div>
    <% }) %>
</div>
</div>
