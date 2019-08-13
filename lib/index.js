'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  var className = void 0;

  return {
    name: 'babel-plugin-component-identification',
    visitor: {
      ClassDeclaration: function ClassDeclaration(_ref2) {
        var name = _ref2.node.id.name;

        className = name;
      },
      ReturnStatement: function ReturnStatement(path) {
        var argument = path.node.argument;

        if (argument && argument.type !== 'JSXElement') {
          return;
        }

        var _path$getFunctionPare = path.getFunctionParent(),
            parentId = _path$getFunctionPare.node.id,
            functionalComponent = _path$getFunctionPare.parent;

        var isClassInstanceMethod = parentId && parentId.name;
        var isClassRenderMethod = className && parentId && parentId.name === 'render';
        var isFunctionalComponent = functionalComponent && functionalComponent.id;
        var identity = void 0;

        if (isClassRenderMethod) {
          identity = className;
        } else if (isFunctionalComponent) {
          identity = functionalComponent.id.name;
        } else if (isClassInstanceMethod) {
          identity = parentId.name;
        } else {
          // last ditch effort at looking for a named component
          // might just want to ignore these entirely
          var parent = path.findParent(function (pp) {
            return pp.isVariableDeclaration();
          });
          if (parent) {
            var _parent$node$declarat = parent.node.declarations,
                declarations = _parent$node$declarat === undefined ? [] : _parent$node$declarat;

            identity = declarations[0].name;
          }
        }

        if (argument && identity) {
          var newAttributes = [t.jSXAttribute(t.jSXIdentifier('data-component-id'), t.stringLiteral(identity))];
          var property = argument.openingElement.name.property;

          if (!property || property.name !== "Fragment") {
            var _argument$openingElem;

            (_argument$openingElem = argument.openingElement.attributes).push.apply(_argument$openingElem, newAttributes);
          }
        }
      }
    }
  };
};