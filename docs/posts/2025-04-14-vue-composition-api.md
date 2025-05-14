---
title: Vue Composition API详解：超越Options API的组件逻辑组织方案
description: 深入了解Vue3 Composition API的原理、优势及其与Options API的对比
excerpt: Vue3的Composition API为组件逻辑组织提供了全新的方式，本文将详细介绍其工作原理、优势及与传统Options API的对比，帮助开发者更好地理解和应用这一特性。
categories:
  - 技术
tags:
  - JavaScript
  - Vue

date: 2025-04-14
image: /bg6.jpg
head:
  - - meta
    - name: description
      content: 深入了解Vue3 Composition API的原理、优势及其与Options API的对比
---



Composition API 是 Vue3 的最大特点之一，它为我们提供了一种全新的组织组件逻辑的方式。本文将深入探讨 Composition API 的工作原理、优势，以及它与传统 Options API 的对比。

<!-- more -->

## 开始之前

Composition API 可以说是Vue3的最大特点，那么为什么要推出Composition API，解决了什么问题？

通常使用Vue2开发的项目，普遍会存在以下问题：

- 代码的可读性随着组件变大而变差
- 每一种代码复用的方式，都存在缺点
- TypeScript支持有限

以上问题通过使用Composition API都能迎刃而解。

## 一、Options API

Options API，即大家常说的选项API，即以vue为后缀的文件，通过定义methods，computed，watch，data等属性与方法，共同处理页面逻辑。

在Options API中，组件的逻辑是按选项组织的：

```javascript
export default {
  data() {
    return {
      count: 0,
      user: { name: 'John', age: 30 }
    }
  },
  methods: {
    increment() {
      this.count++
    },
    getUserInfo() {
      return `${this.user.name}, ${this.user.age} years old`
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
```

可以看到Options代码编写方式，如果是组件状态，则写在data属性上，如果是方法，则写在methods属性上...

用组件的选项 (data、computed、methods、watch) 组织逻辑在大多数情况下都有效。

然而，当组件变得复杂，导致对应属性的列表也会增长，这可能会导致组件难以阅读和理解。

## 二、Composition API

在 Vue3 Composition API 中，组件根据逻辑功能来组织的，一个功能所定义的所有 API 会放在一起（更加的高内聚，低耦合）。

即使项目很大，功能很多，我们都能快速的定位到这个功能所用到的所有 API。

```javascript
import { ref, computed, onMounted, watch } from 'vue'

export default {
  setup() {
    // 状态管理
    const count = ref(0)
    const user = ref({ name: 'John', age: 30 })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    function increment() {
      count.value++
    }
    
    function getUserInfo() {
      return `${user.value.name}, ${user.value.age} years old`
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log('Component mounted')
    })
    
    // 监听变化
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })
    
    // 返回需要暴露给模板的内容
    return {
      count,
      user,
      doubleCount,
      increment,
      getUserInfo
    }
  }
}
```

## 三、对比

下面对Composition API与Options API进行两大方面的比较：
- 逻辑组织
- 逻辑复用

### 逻辑组织

#### Options API

假设一个组件是一个大型组件，其内部有很多处理逻辑关注点（比如用户信息、商品列表、购物车等）。

在Options API中，相关逻辑被分散到不同的选项中：

```javascript
export default {
  data() {
    return {
      // 用户相关
      userName: '',
      userAge: 0,
      userAddress: '',
      
      // 商品相关
      products: [],
      selectedProduct: null,
      productQuantity: 1,
      
      // 购物车相关
      cartItems: [],
      cartTotal: 0
    }
  },
  methods: {
    // 用户相关
    fetchUserInfo() { /* ... */ },
    updateUserInfo() { /* ... */ },
    
    // 商品相关
    fetchProducts() { /* ... */ },
    selectProduct() { /* ... */ },
    
    // 购物车相关
    addToCart() { /* ... */ },
    removeFromCart() { /* ... */ },
    calculateTotal() { /* ... */ }
  },
  computed: {
    // 用户相关
    userFullInfo() { /* ... */ },
    
    // 商品相关
    discountedPrice() { /* ... */ },
    
    // 购物车相关
    cartItemCount() { /* ... */ }
  },
  watch: {
    // 各种监听...
  },
  mounted() {
    // 初始化逻辑混合在一起
    this.fetchUserInfo()
    this.fetchProducts()
  }
}
```

可以看到，这种碎片化使得理解和维护复杂组件变得困难。

选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地"跳转"相关代码的选项块。

#### Composition API

而Composition API正是解决上述问题，将某个逻辑关注点相关的代码全都放在一个函数里，这样当需要修改一个功能时，就不再需要在文件中跳来跳去。

下面举个简单例子，将处理count属性相关的代码放在同一个函数了：

```javascript
function useCount() {
    let count = ref(10);
    let double = computed(() => {
        return count.value * 2;
    });

    const handleCount = () => {
        count.value = count.value * 2;
    };

    console.log(count);

    return {
        count,
        double,
        handleCount,
    };
}
```

在组件中使用count：

```javascript
export default defineComponent({
    setup() {
        const { count, double, handleCount } = useCount();
        return {
            count,
            double,
            handleCount
        }
    },
});
```

对于上面复杂的例子，我们可以将相关逻辑组织在一起：

```javascript
// 用户相关逻辑
function useUser() {
  const userName = ref('')
  const userAge = ref(0)
  const userAddress = ref('')
  
  function fetchUserInfo() { /* ... */ }
  function updateUserInfo() { /* ... */ }
  
  const userFullInfo = computed(() => { /* ... */ })
  
  return {
    userName,
    userAge,
    userAddress,
    fetchUserInfo,
    updateUserInfo,
    userFullInfo
  }
}

// 商品相关逻辑
function useProducts() {
  const products = ref([])
  const selectedProduct = ref(null)
  const productQuantity = ref(1)
  
  function fetchProducts() { /* ... */ }
  function selectProduct() { /* ... */ }
  
  const discountedPrice = computed(() => { /* ... */ })
  
  return {
    products,
    selectedProduct,
    productQuantity,
    fetchProducts,
    selectProduct,
    discountedPrice
  }
}

// 购物车相关逻辑
function useCart() {
  const cartItems = ref([])
  const cartTotal = ref(0)
  
  function addToCart() { /* ... */ }
  function removeFromCart() { /* ... */ }
  function calculateTotal() { /* ... */ }
  
  const cartItemCount = computed(() => { /* ... */ })
  
  return {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    calculateTotal,
    cartItemCount
  }
}

export default {
  setup() {
    const user = useUser()
    const products = useProducts()
    const cart = useCart()
    
    onMounted(() => {
      user.fetchUserInfo()
      products.fetchProducts()
    })
    
    return {
      ...user,
      ...products,
      ...cart
    }
  }
}
```

这样，每个关注点的逻辑都被封装在各自的函数中，便于理解和维护。

### 逻辑复用

#### Options API - Mixins

在Vue2中，我们通过mixin去复用相同的逻辑。

下面举个例子，我们会另起一个mixin.js文件：

```javascript
export const MoveMixin = {
  data() {
    return {
      x: 0,
      y: 0,
    };
  },

  methods: {
    handleKeyup(e) {
      console.log(e.code);
      // 上下左右 x y
      switch (e.code) {
        case "ArrowUp":
          this.y--;
          break;
        case "ArrowDown":
          this.y++;
          break;
        case "ArrowLeft":
          this.x--;
          break;
        case "ArrowRight":
          this.x++;
          break;
      }
    },
  },

  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
  },

  unmounted() {
    window.removeEventListener("keyup", this.handleKeyup);
  },
};
```

然后在组件中使用：

```html
<template>
  <div>
    Mouse position: x {{ x }} / y {{ y }}
  </div>
</template>
<script>
import mousePositionMixin from './mouse'
export default {
  mixins: [mousePositionMixin]
}
</script>
```

使用单个mixin似乎问题不大，但是当我们一个组件混入大量不同的 mixins 的时候：

```javascript
mixins: [mousePositionMixin, fooMixin, barMixin, otherMixin]
```

会存在两个非常明显的问题：

- 命名冲突
- 数据来源不清晰

#### Composition API - 组合函数

现在通过Composition API这种方式改写上面的代码：

```javascript
import { onMounted, onUnmounted, reactive } from "vue";
export function useMove() {
  const position = reactive({
    x: 0,
    y: 0,
  });

  const handleKeyup = (e) => {
    console.log(e.code);
    // 上下左右 x y
    switch (e.code) {
      case "ArrowUp":
        position.y--;
        break;
      case "ArrowDown":
        position.y++;
        break;
      case "ArrowLeft":
        position.x--;
        break;
      case "ArrowRight":
        position.x++;
        break;
    }
  };

  onMounted(() => {
    window.addEventListener("keyup", handleKeyup);
  });

  onUnmounted(() => {
    window.removeEventListener("keyup", handleKeyup);
  });

  return { position };
}
```

在组件中使用：

```html
<template>
  <div>
    Mouse position: x {{ x }} / y {{ y }}
  </div>
</template>

<script>
import { useMove } from "./useMove";
import { toRefs } from "vue";
export default {
  setup() {
    const { position } = useMove();
    const { x, y } = toRefs(position);
    return {
      x,
      y,
    };
  },
};
</script>
```

可以看到，整个数据来源清晰了，即使去编写更多的 hook 函数，也不会出现命名冲突的问题。

## 小结

在逻辑组织和逻辑复用方面，Composition API是优于Options API的：

1. Composition API几乎是函数，会有更好的类型推断
2. Composition API对 tree-shaking 友好，代码也更容易压缩
3. Composition API中见不到this的使用，减少了this指向不明的情况
4. 如果是小型组件，可以继续使用Options API，也是十分友好的

在实际项目中，我们可以根据组件的复杂度和需求来选择使用 Options API 还是 Composition API。对于简单的组件，Options API 可能更加直观和易用；而对于复杂的组件或需要在不同组件之间共享逻辑的场景，Composition API 则提供了更好的解决方案。

## 参考文献

- [Vue3官方文档 - Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Vue组合式API介绍](https://vue3js.cn/docs/zh/guide/composition-api-introduction.html)
- [深入理解Vue3 Composition API](https://juejin.cn/post/6940454764421316644) 