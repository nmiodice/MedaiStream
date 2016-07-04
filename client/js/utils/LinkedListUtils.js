
var LinkedListUtils = {

	fromList : function(xs) {
		var head = null;
		var tail = null;

		xs.forEach(function(x) {
			tail = LinkedListUtils._appendItem(tail, x);
			if (head == null)
				head = tail;

		});

		return head;
	},

	_appendItem : function(tail, x) {

		var node = {
			prev : tail,
			data : x,
			next : null,
			position : tail == null ? 0 : tail.position + 1,
			metadata : tail == null ? { listSize : 0 } : tail.metadata
		};

		// increment global list size
		node.metadata.listSize++;

		if (tail != null) {
			tail.next = node;
		}

		return node;
	},

	find : function(xs, x) {
		var curr = xs;

		while (curr != null) {
			if (curr.data == x)
				return curr;
			curr = curr.next;
		}

		return null;
	}
};

module.exports = LinkedListUtils;