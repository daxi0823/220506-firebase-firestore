<template>
  <div id="main__wrapper">
    <HeaderComp></HeaderComp>
    <main>
      <section id="mv" class="mv__less">
        <div class="copy__wrapper">
          <h2 class="mv__ttl">メニュー登録</h2>
          <h3>Save on Firebase</h3>
          <label>メニュー名<input v-model="menuName" type="text"></label>
          <!-- ref重要：refの名前で、後から入力データを取れる -->
          <label>メニュー画像：<input ref="imgUp" type="file" id="fileImg"></label>
          <button @click="imgUpload">アップロード</button>
          <label>メニュー説明<textarea v-model="menuText" cols="30" rows="10"></textarea></label>
          <button @click="addMenu">データ登録</button>

          <h2 class="mv__ttl">登録済みメニューリスト</h2>
          <ul>
            <li v-for="(menu, index) in menus" :key="menu.id">
              <p>{{ menu.name }}</p>
              <p><img :src="menu.imgUrl" alt=""></p>
              <p>{{ menu.text }}</p>
              <button @click="removeMenu(menu.docId, index)">データ削除</button>
            </li>
          </ul>


        </div><!--copy__wrapper-->
      </section><!--mv-->
    </main>
  </div><!--main_wrapper-->
</template>

<script>
import HeaderComp from '@/components/HeaderComp.vue';

// firebase.jsでexportした上で、使用する場所でimport
import firebaseApp from '@/firebase/firebase';
// moduleの中の、firestoreから、必要な機能をimport（後からも追加できる）
import {getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc} from 'firebase/firestore';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';


// これでdb記述で全ての場所で使える
const db = getFirestore(firebaseApp)
const storage = getStorage();

export default {
  data() {
    return {
      menuId: 1,
      menuName: '',
      menuText: '',
      menuImgUrl: '',
      
      file: '',
      menus: [
        {
          id: null,
          name: null,
          text: null,
          imgUrl: null,
        }
      ],
    }
  },
  components: {
    HeaderComp,
  },

  // mounted: domができてから
  mounted() {
    // 並べ方の指定orderBy
    const q = query(collection(db, 'menus'), orderBy('menuId'))

    // 先頭のデータ(id=0)を削除
    this.menus.splice(0, 1);
    onSnapshot(q, snapshot => {
      // docChanges：非同期、データベース上のデータ変更を通知
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('added', change.doc.data())
          this.menus.push({
            id: change.doc.data().menuId,
            name: change.doc.data().menuName,
            text: change.doc.data().menuText,
            docId: change.doc.id,
            imgUrl: change.doc.data().menuImgUrl,
          })
          this.menuId = change.doc.data().menuId;
        }
        if(change.type === 'removed') {
          console.log('removed', change.doc.data());
        }
      })
    })
  },

  methods: {
    addMenu() {
      // db:getFirestore(firebaseApp)は必須
      // 第二引数はfirestoreのコレクション名
      // menuName:menu
      addDoc(collection(db, 'menus'), {
        menuId: this.menuId++,
        // menuName:フィールド
        menuName: this.menuName,
        // menuText:フィールド
        menuText: this.menuText,
        // serverTimestampは
        created: serverTimestamp(),
        menuImgUrl: this.menuImgUrl,
      })
      .then((doc) => {
        // バッククオート
        console.log(`データ追加に成功しました(${doc.id})`)
        // 追加に成功したら、入力欄を空にする
        this.menuName = '';
        this.menuText = '';
        const menuImgUrlRemain = document.getElementById('fileImg');
        menuImgUrlRemain.value = '';
      })
      .catch(error => {
        // エラー時の処理
        console.log(`データ追加に失敗しました(${error})`)
      })
    },
    removeMenu(id, index) {
      // id: docId /////////////////////////////////
      deleteDoc(doc(db, 'menus', id));
      // 描画を変更
      this.menus.splice(index, 1);
    },
    imgUpload() {
      // ファイルの取得
      // $refs.imgUp： refsで指定した'imgUp'のデータを取得
      this.file = this.$refs.imgUp.files[0];
      // console.log(this.file);

      // 画像へのパスを作る
      const userImageRef = ref(storage, `images/${this.file.name}`)
      // 画像ファイルのアップロード
      uploadBytesResumable(userImageRef, this.file)
      .then(snapshot => {
        // console.log('アップロード完了', snapshot)
        getDownloadURL(snapshot.ref)
        .then(downloadURL => {
          console.log('Success!', downloadURL);
          this.menuImgUrl = downloadURL;
        })
        .catch(error => {
          console.log(error);
        })
      })
    }
  }
}
</script>



<style scoped>
label {
  text-align: left;
  margin-top: 40px;
}
</style>
