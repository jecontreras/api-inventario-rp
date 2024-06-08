/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    /***************************************************************************
    *                                                                          *
    * Want to use a different database during development?                     *
    *                                                                          *
    * 1. Choose an adapter:                                                    *
    *    https://sailsjs.com/plugins/databases                                 *
    *                                                                          *
    * 2. Install it as a dependency of your Sails app.                         *
    *    (For example:  npm install sails-mysql --save)                        *
    *                                                                          *
    * 3. Then pass it in, along with a connection URL.                         *
    *    (See https://sailsjs.com/config/datastores for help.)                 *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'sails-mysql',
    // url: 'mysql://user:password@host:port/database',
    adapter: 'sails-mongo',
    //url: "mongodb://jose147:98090871986@ac-iomua28-shard-00-00.tkeuqas.mongodb.net:27017,ac-iomua28-shard-00-01.tkeuqas.mongodb.net:27017,ac-iomua28-shard-00-02.tkeuqas.mongodb.net:27017/inventariocrm?ssl=true&replicaSet=atlas-ozobsv-shard-0&authSource=admin&retryWrites=true&w=majority",
    //url: "mongodb://jose147:98090871986@ac-t9jgzc9-shard-00-00.h2jgodv.mongodb.net:27017,ac-t9jgzc9-shard-00-01.h2jgodv.mongodb.net:27017,ac-t9jgzc9-shard-00-02.h2jgodv.mongodb.net:27017/iventariocrm?ssl=true&replicaSet=atlas-12cf5b-shard-0&authSource=admin&retryWrites=true&w=majority"
    // url: 'mongodb://localhost:27017/apirp'
    url: "mongodb://jose147:98090871986@ac-zm5fgsm-shard-00-00.v8dpbxu.mongodb.net:27017,ac-zm5fgsm-shard-00-01.v8dpbxu.mongodb.net:27017,ac-zm5fgsm-shard-00-02.v8dpbxu.mongodb.net:27017/inventariocrm?ssl=true&replicaSet=atlas-m28i4e-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",

    /*host: 'localhost',
    user: 'root',
    password: '',
    database: 'apirp'*/
  },


};
