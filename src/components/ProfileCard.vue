<template>
  <article class="bg-gradient-to-tl from-blue-200 to-blue-100 rounded-lg p-2">
    <!-- 로그인 했을 때 -->
    <div v-if="user" class="flex flex-col space-y-1">
      <div class="flex justify-between text-xl">
        <h2>총 자산</h2>
        <h2>123,123원</h2>
      </div>
      <div class="flex justify-between">
        <span>현금</span>
        <span>123,123원</span>
      </div>
      <hr />
      <table class="text-sm">
        <thead class="text-right text-slate-500">
          <tr>
            <th class="text-left">이름</th>
            <th>평단가</th>
            <th>손익</th>
            <th>수량</th>
            <th>평가</th>
          </tr>
        </thead>
        <!-- 내 지갑 반복 -->
        <tbody class="text-right">
          <tr>
            <td class="text-left">비트코인</td>
            <td>123,123</td>
            <td>12%</td>
            <td>123</td>
            <td>123,123</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 로그인 안했을 때 -->
    <div v-else class="flex justify-center items-center">
      <button class="cursor-pointer underline underline-offset-2">내 자산을 보시려면 로그인해주세요</button>
    </div>
  </article>
</template>

<script>
export default {
  name: "ProfileCard",
  data() {
    return {
      user: true,
    }
  },
}
</script>