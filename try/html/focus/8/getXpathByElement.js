/**
 * エレメントノードからxpathを構築します。
 *
 * @param   Node    element_node    xpath構築元のelement node
 * @returns element nodeまでのxpath
 * https://qiita.com/ProjectICKX/items/eb4a48598a15675897cb
 */
function getXpathByElementNode (element_node) {
    var NODE_TYPE_ELEMENT_NODE = 1;

    if (element_node instanceof Array) {
        element_node = element_node[0];
    }

    if (element_node.nodeType != NODE_TYPE_ELEMENT_NODE) {
        throw new ErrorException('nodes other than the element node was passed. node_type:'+ element_node.nodeType +' node_name:'+ element_node.nodeName);
    }

    var stacker = [];
    var node_name = '';
    var node_count = 0;
    var node_point = null;

    do {
        node_name = element_node.nodeName.toLowerCase();
        if (element_node.parentNode.children.length > 1) {
            node_count = 0;
            node_point = null;
            for (i = 0;i < element_node.parentNode.children.length;i++) {
                if (element_node.nodeName == element_node.parentNode.children[i].nodeName) {
                    node_count++;
                    if (element_node == element_node.parentNode.children[i]) {
                        node_point = node_count;
                    }
                    if (node_point != null && node_count > 1) {
                        node_name += '['+ node_point +']';
                        break;
                    }
                }
            }
        }
        stacker.unshift(node_name);
    } while ((element_node = element_node.parentNode) != null && element_node.nodeName != '#document');

    return '/' + stacker.join('/').toLowerCase();
}

