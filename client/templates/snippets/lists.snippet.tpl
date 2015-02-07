<div class="lists">
    <div>
        <select class="list">
            <option value=null>set Bookmark to a list</option>
            <% if (lists && lists.length !== 0) {
                _.each(lists, function(list) {
                    var selected = (currentList == list.get('id')) ? 'selected' : '';
                    %>
                    <option value="<%= list.get('id') %>" selected="<%= selected %>"><%= list.get('name') %></option>
                <% });
            } %>
        </select>
        <span>
            <a>new list</a>
        </span>
    </div>

    <div class="add_new">
        <input type="text" placeholder="enter new list name">
        <button class="createList">create list</button>
        <hr>
    </div>
</div>
