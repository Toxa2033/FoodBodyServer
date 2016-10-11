/**
 * Created by 95tox on 02.09.2016.
 */
var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    // create an admin application
    var admin = nga.application('My First Admin')
        .debug(true)
        .baseApiUrl('http://localhost:3000/'); // main API endpoint
    // create a user entity
    // the API endpoint for this entity will be 'http://jsonplaceholder.typicode.com/users/:id
    var user = nga.entity('users')
        .identifier(nga.field('_id'));
    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('_id').isDetailLink(true),
        nga.field('externalName')
    ]);


    user.creationView().fields([
        nga.field('internalName'),
        nga.field('externalName'),
        nga.field('email', 'email'),
        nga.field('facebookId'),
        nga.field('instagramId')
    ]);
// use the same fields for the editionView as for the creationView
    user.editionView().fields(user.creationView().fields());



    var post = nga.entity('posts')
        .identifier(nga.field('_id'));
    post.listView().fields([
        nga.field('_id').isDetailLink(true),
        nga.field('text'),
        nga.field('commentCount'),
        nga.field('owner.externalName')
            .label('Owner')
    ]);

    post.showView().fields([
        nga.field('text'),
        nga.field('image.url','template')
            .template(function(entry){
                var url=entry.values.image.url;
               return '<img src="{{url}}">'   // не работает не знаю почему
            }),
        nga.field('owner.externalName')
            .label('Owner'),
        nga.field('comments', 'embedded_list')
            .targetFields([
                nga.field('_id'),
                nga.field('text'),
                nga.field('owner.externalName')
                    .label('Owner')
            ])

    ]);




    var comment = nga.entity('comments')
        .identifier(nga.field('_id'));

    admin.addEntity(comment);

    admin.addEntity(post);
    // add the user entity to the admin application
    admin.addEntity(user);
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
