import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import * as SQLite from "expo-sqlite";

import { electrify } from "electric-sql/expo";
import { makeElectricContext, useLiveQuery } from "electric-sql/react";
import { genUUID } from "electric-sql/util";

import { authToken } from "./auth";
import { DEBUG_MODE, ELECTRIC_URL } from "./config";
import { Electric, schema } from "./generated/client";
import { styles } from "./styles";

const { ElectricProvider, useElectric } = makeElectricContext<Electric>();

export const Example = () => {
  const [electric, setElectric] = useState<Electric>();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const config = {
        auth: {
          token: authToken(),
        },
        debug: DEBUG_MODE,
        url: ELECTRIC_URL,
      };

      const conn = SQLite.openDatabase("electric.db");
      const electric = await electrify(conn, schema, config);

      if (!isMounted) {
        return;
      }

      setElectric(electric);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  if (electric === undefined) {
    return null;
  }

  return (
    <ElectricProvider db={electric}>
      {/* <ExampleComponent /> */}
      <ExampleComponentCivalgo />
    </ElectricProvider>
  );
};

// const ExampleComponent = () => {
//   const { db } = useElectric()!
//   const { results } = useLiveQuery(
//     db.items.liveMany()
//   )

//   useEffect(() => {
//     const syncItems = async () => {
//       // Resolves when the shape subscription has been established.
//       const shape = await db.items.sync()

//       // Resolves when the data has been synced into the local database.
//       await shape.synced
//     }

//     syncItems()
//   }, [])

//   const addItem = async () => {
//     await db.items.create({
//       data: {
//         value: genUUID(),
//       }
//     })
//   }

//   const clearItems = async () => {
//     await db.items.deleteMany()
//   }

//   const items: Item[] = results ?? []

//   return (
//     <View>
//       <View style={ styles.iconContainer }>
//         <Image source={require('../assets/icon.png')} />
//       </View>
//       <View style={ styles.buttons }>
//         <Pressable style={ styles.button } onPress={ addItem }>
//           <Text style={ styles.text }>
//             Add
//           </Text>
//         </Pressable>
//         <Pressable style={ styles.button } onPress={ clearItems }>
//           <Text style={ styles.text }>
//             Clear
//           </Text>
//         </Pressable>
//       </View>
//       <View style={ styles.items }>
//         {items.map((item: Item, index: number) => (
//           <Text key={ index } style={ styles.item }>
//             Item { index + 1 }
//           </Text>
//         ))}
//       </View>
//     </View>
//   )
// }

const ExampleComponentCivalgo = () => {
  const { db } = useElectric()!;
  // const { results } = useLiveQuery(db.User.liveMany());

  // console.log(results);

  useEffect(() => {
    const syncItems = async () => {
      // Resolves when the shape subscription has been established.
      const shape = await db.User.sync({
        include: {
          ApiKey: true,
          DailyLog: true,
          DailyLogItem: true,
          Equipment_Equipment_createdByToUser: true,
          Equipment_Equipment_userIdToUser: true,
          EquipmentProperty: true,
          EquipmentPropertyValue: true,
          Feedback: true,
          File: true,
          FileProperty: true,
          FilePropertyValue: true,
          Image_Image_createdByToUser: true,
          LocationEntry: true,
          Project: true,
          ProjectProperty: true,
          ProjectPropertyValue: true,
          Task: true,
          TaskProperty: true,
          TaskPropertyValue: true,
          TaskStatus: true,
          Tenant_Tenant_createdByToUser: true,
          TenantUser_TenantUser_createdByToUser: true,
          TenantUser_TenantUser_userIdToUser: true,
          TimeBlock: true,
          UserTask_UserTask_createdByToUser: true,
          UserTask_UserTask_userIdToUser: true,
        },
      });

      // Resolves when the data has been synced into the local database.
      await shape.synced;
    };

    syncItems();
  }, []);

  const addItem = async () => {
    try {
      const newTenant = await db.Tenant.create({
        data: {
          id: genUUID(),
          name: "tenantName",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      const newUser = await db.User.create({
        data: {
          id: genUUID(),
          email: `${genUUID()}@example.com`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentTenantId: newTenant.id,
        },
      });
    } catch (error) {
      console.log("create error ============================", error);
    }
  };

  const clearItems = async () => {
    await db.User.deleteMany();
  };

  const findItems = async () => {
    try {
      const result = await db.User.findMany({});
      console.log("find result ============================", result);
    } catch (error) {
      console.log("find result error============================", error);
    }
  };

  return (
    <View>
      <View style={styles.iconContainer}>
        <Image source={require("../assets/icon.png")} />
      </View>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>Add</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={clearItems}>
          <Text style={styles.text}>Clear</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={findItems}>
          <Text style={styles.text}>Find</Text>
        </Pressable>
      </View>
      {/* <View style={styles.items}>
        {items.map((item: Item, index: number) => (
          <Text key={index} style={styles.item}>
            Item {index + 1}
          </Text>
        ))}
      </View> */}
    </View>
  );
};
