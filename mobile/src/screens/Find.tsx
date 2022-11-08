import { useState } from "react";
import { Heading, VStack, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Find() {
	const { navigate } = useNavigation();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState("");

	async function handleJoinPoll() {
		try {
			setIsLoading(true);

			if (!code.trim()) {
				return toast.show({
					title: "Informe o código.",
					placement: "top",
					bgColor: "red.500",
				});
			}

			await api.post("/polls/join", { code });

			toast.show({
				title: "Entrou no bolão com sucesso.",
				placement: "top",
				bgColor: "green.500",
			});

			navigate("polls");
		} catch (error) {
			console.log(error);
			setIsLoading(false);

			if (error.response?.data?.message === "Bolão não encontrado.") {
				return toast.show({
					title: "Bolão não encontrado.",
					placement: "top",
					bgColor: "red.500",
				});
			}
			if (
				error.response?.data?.message ===
				"Você já participa deste bolão."
			) {
				return toast.show({
					title: "Você já esta neste bolão.",
					placement: "top",
					bgColor: "red.500",
				});
			}

			return toast.show({
				title: "Não foi possível encontrar o bolão.",
				placement: "top",
				bgColor: "red.500",
			});
		}
	}

	return (
		<VStack flex={1} bgColor={"gray.900"}>
			<Header title={"Buscar por código"} showBackButton />
			<VStack mt={8} mx={5} alignItems={"center"}>
				<Heading
					fontFamily={"heading"}
					color={"white"}
					fontSize={"xl"}
					textAlign={"center"}
					mb={8}
				>
					Encontre um bolão através de seu código único
				</Heading>

				<Input
					mb={4}
					placeholder={"Qual o código do bolão?"}
					autoCapitalize={"characters"}
					onChangeText={setCode}
				/>
				<Button
					title={"Buscar Bolão"}
					isLoading={isLoading}
					onPress={handleJoinPoll}
				/>
			</VStack>
		</VStack>
	);
}
